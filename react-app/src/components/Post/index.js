import "./Post.css"
import OpenModalButton from "../OpenModalButton"
import { useSelector } from "react-redux";
import AddComment from "../AddComment";
import ShowComment from "../ShowComment";
import ThreeDots from "../ThreeDots";


function Post({ post }) {

    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser.id)
    // console.log(post.post_user_id)
    const allCommentsObj = useSelector(state => state.comments.allComments)
    const allComments = allCommentsObj ? Object.values(allCommentsObj) : []
    const postComments = allComments.filter(comment => comment.comment_post_id === post.post_id)
    // console.log("%%%post id", post.post_id)
    // console.log("%%%post comments", postComments)
    // console.log("@@@@",post)

    // let sessionLinks;

    // const commentSvg = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
    //     <path d="M7 9h10v1H7zm0 4h7v-1H7zm16-2a6.78 6.78 0 01-2.84 5.61L12 22v-4H8A7 7 0 018 4h8a7 7 0 017 7zm-2 0a5 5 0 00-5-5H8a5 5 0 000 10h6v2.28L19 15a4.79 4.79 0 002-4z"></path>
    // </svg>)



    return (
        <>
            <div className="indi-post-area">

                <div className="post-top-section">

                    <div className="about-the-poster">
                        <img className="profile-photo" src={post.profile_photo} alt=""></img>
                        <div className="name-and-title">


                            <div className="post-user-name">{post.post_user_first_name} {post.post_user_last_name}</div>


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
                        <OpenModalButton
                            buttonText="Comment"
                            className="comment-button"
                            modalComponent={<AddComment post={post} />}
                        />

          

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