import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
  //app.js에서 profile을 업데이트 했을때 새로 랜더링 해주는 refreshUser를 받아온다.
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  //로그아웃 버튼 눌렀을 때, 홈으로 돌아가기
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  //   const getMyNweets = async () => {
  //     const nweets = await dbService
  //       .collection("nweets")
  //       .where("creatorId", "==", userObj.uid)
  //       .orderBy("createAt")
  //       .get();
  //     console.log(nweets.docs.map((doc) => doc.data()));
  //   };

  //   useEffect(() => {
  //     getMyNweets();
  //   }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
