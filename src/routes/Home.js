import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  //router.js에서 보내준 prop을 받음.
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  //getNweets로 하는 방식은 구식이다.
  // const getNweets = async () => {
  //     const dbNweets = await dbService.collection("nweets").get();
  //     dbNweets.forEach((document) => {
  //         //가끔 set이 붙은 함수를 쓸 때, 값 대신 함수를 전달할 수 있다.
  //         //그리고 만약 함수를 전달하면, 리액트는 이전 값에 접근할 수 있게 해준다.
  //         // setNweets(prev => [document.data(), ...prev]); //배열을 리턴하는데 새로운 data먼저 리턴하고, 뒤에 이전에 data들을 붙인다.

  //         //document.data()보다 더 보기 좋은 코딩을 위해 Nweet의 객체를 만든다.
  //         const nweetObject = {
  //             ...document.data(), //spread로 document.data()의 데이터를 가져와 풀어줌.즉, 데이터의 내용물
  //             id: document.id,

  //         }
  //         setNweets(prev => [nweetObject, ...prev]);
  //     });
  // }

  useEffect(() => {
    // getNweets(); 구식
    //home.js에서 listener로 snapshot을 사용.
    //onSnapshot은 기본적으로 db에 무슨일 있을 때, 알림을 받는것.
    dbService.collection("nweets").onSnapshot((snapshot) => {
      //새로운 스냅샷을 받을 때 배열을 만듦.
      //snapshot은 우리가 가진 query와 같으며 docs을 가지고 있다.
      //forEach를 사용할 수 있지만 map은 더 적게 re-render하기 때문에 더 빠르게 실행된다.
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray); //state에 배열을 집어 넣음.
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = ""; //lexical scope로 인해 if안쪽에 선언된 attachmentUrl을 바깥으로 빼줌.
    if (attachment !== "") {
      //fbase에서 storageService를 가져온 뒤 ref라는 버켓을 만들고 그 안에 child를 만드는데 그 child는 기본적으로 이미지의 path이다.
      //uuid로 무작위로 unique한 아이디를 생성
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      //attachment는 이미지의 string형태이고 Filereader로 이미지를 url형식으로 바꿔줘서, format을 data_url로 지정해준다.
      const response = await attachmentRef.putString(attachment, "data_url");
      //response의 url를 가져다쓰면 막힘.
      //그래서 firebase/ref에 있는 getDownloadURL을 사용하여 url을 다운로드함.
      //이 경우에 promise를 내장하고 있어 await를 사용해주어야 함.
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet, //nweet는 state인 nweet의 value값
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    // firebase 제공 add를 사용하여 db에 저장
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  //이미지 업로드시 미리보기 함수
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    //file을 가져오기
    const theFile = files[0];
    //file reader API 사용(검색해보기)
    const reader = new FileReader();
    //FileReader가 바로 나타나지 않기 때문에 event적용
    reader.onloadend = (finishedEvent) => {
      //2. 이곳에서 온로드가 끝난후 finishedEvent를 보내줌
      const {
        currentTarget: { result }, //3.currentTarget에 있는 result(사진 URL)을 finishEvent에 넣어주고
      } = finishedEvent;
      setAttachment(result); //4. result를 setAttachment로 설정
    };
    reader.readAsDataURL(theFile); //1.여기서 파일을 읽기 시작
  };
  const onClearAttachment = () => setAttachment(null); //setAttachment를 null로 지정하여 이미지 지우기
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>이미지 지우기</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          //Nweet.js를 import해와서 isOwner는 creatorId와 uid가 같은 것들을 지정해 준다.
          //Nweet component는 두 개의 prop을 가지는데 nweetObj와 isOwner 다.
          //nweetObj는 nweet의 모든 데이터이다. author, text, createAt을 다 가진다.
          //isOwner은 true || false값을 가진다.
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
