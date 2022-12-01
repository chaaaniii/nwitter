import { dbService } from 'fbase'
import React, { useState } from 'react'

const Nweet = ({ nweetObj, isOwner }) => {
    //editing, setEditing은 true or false를 위함.즉, 에디팅모드인지 아닌지를 알기위해서.
    const [editing, setEditing] = useState(false);
    //newNweet, setNewNweet은 input에 입력된 text를 업데이트.
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("정말 이 게시글을 삭제하시겠습니까?")
        if (ok) {
            //delete
            //doc의 documentPath는 위치가 됩니다.
            //home.js에서 map을 실행하면서 id를 가지고 있는 nweetObj를 보내고 여기서 받아오기 때문에
            //nweetObj.id를 넣어주면 된다.
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault()
        console.log(nweetObj, newNweet);
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text:newNweet,
        })
        //업데이트 되었을 때, 더 이상 editing모드가 아니도록 setEditing(false)를 해준다.
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewNweet(value);
    };
    return (
        <div>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="수정하세요." value={newNweet} required onChange={onChange} />
                            <input type="submit" value="Upate Nweet"/>
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h4>{nweetObj.text}</h4>
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete nweet</button>
                                <button onClick={toggleEditing}>Edit nweet</button>
                            </>
                        )}
                    </>
                )
            }
        </div>
    )
}

export default Nweet;