import "./ShowComment.css"
import { useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import CommentThreeDots from "../CommentThreeDots"



function ShowComment({ post, postComments }) {


    // const [isLoaded, setIsLoaded] = useState(false);
    // const dispatch = useDispatch()

    // useEffect(()=>{
    //     dispatch(getAllComments())
    //         .then(() => setIsLoaded(true));
    // },[dispatch])


    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser)

    // let sessionLinks;

    //can change the use state from true to false later on
    const [showCommnet, setShowComment] = useState(true);
    const ulRef = useRef();

    const openComment = () => {
        if (showCommnet) return;
        setShowComment(true)
    }

    useEffect(() => {
        if (!showCommnet) return;

        const closeComment = (e) => {
            if (!ulRef.current) return
            if (!ulRef.current.contains(e.target)) {
                setShowComment(false);
            }
        };

        document.addEventListener("click", closeComment);

        return () => document.removeEventListener("click", closeComment);
    }, [showCommnet]);

    const ulClassName = "comment-dropdown" + (showCommnet ? "" : " hidden")
    // const closeComment = () => setShowComment(false)


    return (

        <>
            <div className="count-comments">
                {postComments.length > 0 && (<button
                    className="show-comment-button"
                    onClick={openComment}
                >{postComments.length} comments</button>)}
            </div>
            <ul
                className={ulClassName}
                ref={ulRef}
            >
                {
                    postComments.map(comment => {
                        // console.log(comment)

                        return (
                            <div className="comment-container">

                                <div className="comment-user-photo">

                                    <img className="comment-profile-photo" src={comment.comment_user_profile_photo} alt=""></img>


                                </div>
                                <div className="single-comment">
                                    <div className="name-plus-three-dots">
                                        <div className="comment-user-name-title">
                                            <div className="comment-user-name" key={comment.comment_user_first_name}>{comment.comment_user_first_name} {comment.comment_user_last_name}</div>
                                            <div className="comment-user-title">placeholder for user title</div>
                                        </div>
                                        {sessionUser && comment.comment_user_id == sessionUser.id && (
                                            <CommentThreeDots post={post} comment={comment} />
                                        )}


                                    </div>
                                    <div className="comment-content" key={comment.comment_content}>{comment.comment_content}</div>


                                </div>

                            </div>
                        )

                    })
                }
            </ul>


        </>

    )
}

export default ShowComment