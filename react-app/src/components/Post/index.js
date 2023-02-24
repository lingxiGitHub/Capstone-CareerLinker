import "./Post.css"
import OpenModalButton from "../OpenModalButton"
import EditPostModal from "../EditPostModal"
import { useDispatch, useSelector } from "react-redux";
import DeletePost from "../DeletePostModal";
import AddComment from "../AddComment";
import headshot from "./default-user-photo.jpeg"
import ShowComment from "../ShowComment";

function Post({ post }) {

    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser.id)
    // console.log(post.post_user_id)
    const allCommentsObj = useSelector(state => state.comments.allComments)
    const allComments = allCommentsObj ? Object.values(allCommentsObj) : []
    const postComments = allComments.filter(comment => comment.comment_post_id === post.post_id)
    // console.log("%%%post id", post.post_id)
    // console.log("%%%post comments", postComments)
    // console.log("@@@@",post.post_id)

    let sessionLinks;

    if (sessionUser && sessionUser.id == post.post_user_id) {
        sessionLinks = (
            <>
                <OpenModalButton
                    buttonText="Edit"
                    className="left-bottons"
                    modalComponent={<EditPostModal post={post} />}
                />

                <OpenModalButton
                    buttonText="Delete"
                    className="left-bottons"
                    modalComponent={<DeletePost post={post} />}
                />


            </>
        )
    }
    return (
        <>
            <div className="indi-post-area">
                <div className="post-top-section">
                    <img className="profile-photo" src={headshot} alt=""></img>
                    <div className="name-and-title">
                        <div className="post-user-name">{post.post_user_first_name} {post.post_user_last_name}</div>
                        <div className="post-user-title">place holder for titles</div>
                    </div>
                </div>
                <span className="post-content">{post.post_content}</span>
                <img className="indi-post-photo" src={post.post_photo} alt=""></img>
                {/* <div>{post.updated_at}</div> */}

                <div className="post-buttons">
                    <div className="left-bottons">
                        {sessionLinks}
                    </div>
                    <OpenModalButton
                        buttonText="Comment"
                        className="left-bottons"
                        modalComponent={<AddComment post={post} />}
                    />
                    <button>show comments</button>
                </div>

                <div>
                    <div>comments</div>

                    <ShowComment postComments={postComments} post={post} />

                </div>
            </div>
        </>
    )
}

export default Post