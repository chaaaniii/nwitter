import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); //userObj로 대신 할 수 있다.
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    //로그인이 되거나 로그아웃이 될 때, 초기화 시켜준다.
    authService.onAuthStateChanged((user) => { //로그인 됐을 때, user을 받아오고
      if (user) {
        // setIsLoggedIn(true); //userObj로 로그인 판별할 경우 필요가 없어짐.
        setUserObj(user); //받아온 user을 setUserObj에 저장해둔다.
      }
      // } else {
      //   setIsLoggedIn(false); //userObj로 로그인 판별할 경우 필요가 없어짐.
      // }
      setInit(true);
    })
  }, [])

  console.log(authService.currentUser)
  return (
    <>
      {/* 초기화가 되기 전에 문구를 보여준다 */}
      {/* isLoggedIn을 userobj로 대신 할 경우, boolean으로 로그인 유무를 확인. */}
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  )
}

export default App;
