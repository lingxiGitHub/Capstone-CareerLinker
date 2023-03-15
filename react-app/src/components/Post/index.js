import "./Post.css"
import thumbs from "./Thumbs-ss.png"
import OpenModalButton from "../OpenModalButton"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import AddComment from "../AddComment";
import ShowComment from "../ShowComment";
import ThreeDots from "../ThreeDots";
import { addLikeThunk, deleteLikeThunk } from "../../store/like";
import { getAllPosts } from "../../store/post";
import { getAllLikes } from "../../store/like";


function Post({ post }) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser.id)
    // for comments
    const allCommentsObj = useSelector(state => state.comments.allComments)
    const allComments = allCommentsObj ? Object.values(allCommentsObj) : []
    const postComments = allComments.filter(comment => comment.comment_post_id === post.post_id)


    //for likes
    const isLikedStatusObj = useSelector(state => state.likes.allLikes[post.post_id])
    // console.log("isLikedStatusObj", isLikedStatusObj)
    const isLikedStatus = isLikedStatusObj ? Object.values(isLikedStatusObj) : []
    // console.log("isLikedStatus", isLikedStatus)
    const isLiked = isLikedStatus.some(user => user.user_id === sessionUser.id)
    // console.log(isLiked)


    //for connections
    const allConnectionsObj = useSelector(state => state.connections.allConnections)
    const allConnectionsId = allConnectionsObj ? Object.keys(allConnectionsObj) : []
    console.log(allConnectionsId)
    let isConnected = false;
    for (let id in allConnectionsId) {
        if (+id === +post.post_user_id) {
            isConnected = true
        }
    }

    console.log("%%%%", isConnected)




    const [liked, setLiked] = useState(isLiked);
    const commentSvg = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" className="comment-cloud" width="24" height="24" focusable="false">
        <path d="M7 9h10v1H7zm0 4h7v-1H7zm16-2a6.78 6.78 0 01-2.84 5.61L12 22v-4H8A7 7 0 018 4h8a7 7 0 017 7zm-2 0a5 5 0 00-5-5H8a5 5 0 000 10h6v2.28L19 15a4.79 4.79 0 002-4z"></path>
    </svg>)

    // const likeSVG = (

    // )

    const handleLike = async (e) => {
        // e.preventDefault();
        // console.log("liked status", liked)
        // console.log("user_id pass in", sessionUser.id)
        // console.log("post_id pass in", post.post_id)
        const user_id = +sessionUser.id;
        const post_id = +post.post_id

        if (liked == false) {
            await dispatch(addLikeThunk({ user_id, post_id }))
            setLiked(true)
        } else {
            await dispatch(deleteLikeThunk({ user_id, post_id }))
            setLiked(false)
        }

        // dispatch(getAllPosts())
        dispatch(getAllLikes())



    }

    // const handleUnLike =async (e)=>{
    //     await setLiked(false)
    // }


    return (
        <>
            <div className="indi-post-area">

                <div className="post-top-section">

                    <div className="about-the-poster">
                        <img className="profile-photo" src={post.profile_photo} alt=""></img>
                        <div className="name-and-title">


                            <div className="post-user-name">
                                {post.post_user_first_name} {post.post_user_last_name}
                               {isConnected ? (
                                <span className="connected-or-not"> · 1st</span>
                               ):(
                                <button className="connect-in-post">Connect</button>
                               )} 
                            </div>


                            <div className="post-user-title">{post.title}</div>

                        </div>
                    </div>

                    {sessionUser && sessionUser.id == post.post_user_id && (
                        <ThreeDots post={post} />
                    )}


                </div>


                <span className="post-content">{post.post_content}</span>
                <img className="indi-post-photo" src={post.post_photo} alt=""></img>



                {sessionUser && (

                    <div className="comment-and-like">
                        <div>
                            <botton
                                className="comment-button"
                                onClick={() =>
                                    handleLike()

                                }
                            >
                                {isLiked ? (
                                    <>
                                        <img className="thumbs" src="https://static.licdn.com/sc/h/5zhd32fqi5pxwzsz78iui643e" alt=""></img>
                                        <span className="liked"> Liked</span>
                                    </>
                                ) : (
                                    <>
                                        <img className="thumbs" src={thumbs} alt=""></img>
                                        <span> Like</span>
                                    </>

                                )}
                            </botton>
                        </div>

                        <div className="comment-button">
                            {commentSvg}
                            <OpenModalButton
                                buttonText="Comment"
                                className="comment-button"
                                modalComponent={<AddComment post={post} />}
                            />
                        </div>



                    </div>
                )}




                <div>


                    <ShowComment postComments={postComments} post={post} />

                </div>
            </div>
        </>
    )
}

export default Post