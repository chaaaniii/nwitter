import React, { useState,useEffect } from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    //로그인이 되거나 로그아웃이 될 때, 초기화 시켜준다.
    authService.onAuthStateChanged((user) =>{
      if(user){
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])
  
  console.log(authService.currentUser)
  return(
    <>
    {/* 초기화가 되기 전에 문구를 보여준다 */}
    {init ? <AppRouter isLoggedIn={isLoggedIn}/> : "Initializing..."}
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  ) 
}

export default App;
