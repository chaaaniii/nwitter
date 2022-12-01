import Nweet from "components/Nweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ( {userObj} ) => { //router.js에서 보내준 prop을 받음.
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
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
        dbService.collection("nweets").onSnapshot(snapshot => { //새로운 스냅샷을 받을 때 배열을 만듦.
            //snapshot은 우리가 가진 query와 같으며 docs을 가지고 있다.
            //forEach를 사용할 수 있지만 map은 더 적게 re-render하기 때문에 더 빠르게 실행된다.
            const nweetArray = snapshot.docs.map(doc => ({  
                id:doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray)
        });
    }, [])
    const onSubmit = async (event) => {
        event.preventDefault();
        //firebase 제공 add를 사용하여 db에 저장
        await dbService.collection("nweets").add({
            text: nweet, //nweet는 state인 nweet의 value값
            createAt: Date.now(),
            creatorId: userObj.uid,
        });
        setNweet("");
    };
    const onChange = (event) => {
        const { target: { value }, } = event;
        setNweet(value);
    };
    console.log(nweets)
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind" maxLength={120} />
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map(nweet => (
                    //Nweet.js를 import해와서 isOwner는 creatorId와 uid가 같은 것들을 지정해 준다.
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}
export default Home