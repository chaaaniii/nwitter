import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("")
    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                //creat account
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                //log in
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
        } catch (error) {
            setError(error.message)
        };
    };
    //로그인 버튼으로 바뀌는 함수
    const toggleAccount = () => setNewAccount((prev) => !prev) //setNewAccount의 이전 값을 가져와서 그 값의 반대를 리턴
    //소셜 로그인 함수
    const onSocialClick = async(event) => {
        const { target: {name},} = event;
        //firebase에서 제공해주는 함수
        let provider;
        if ( name === "google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github"){
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        //signin pop
        const data = await authService.signInWithPopup(provider)
        console.log(data)
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
                <input type="submit" value={newAccount ? 'Create Account' : 'Sign In'} />
                {/* error메세지가 나타나는 곳 */}
                {error}
            </form>
            {/* newAccount가 참이면 Sing In을 보여주고 아니면 creat Account를 보여준다 */}
            <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with GitHub</button>
            </div>
        </div>
    )
};
export default Auth;