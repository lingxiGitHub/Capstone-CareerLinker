import "./Post.css"
import OpenModalButton from "../OpenModalButton"
import EditPostModal from "../EditPostModal"
import { useDispatch, useSelector } from "react-redux";
import DeletePost from "../DeletePostModal";
import headshot from "./default-user-photo.jpeg"

function Post({ post }) {

    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser.id)
    // console.log(post.post_user_id)

    let sessionLinks;

    if (sessionUser && sessionUser.id == post.post_user_id) {
        sessionLinks = (
            <>
                <OpenModalButton
                    buttonText="Edit"
                    // onItemClick={closeMenu}
                    modalComponent={<EditPostModal post={post} />}
                />

                <OpenModalButton
                    buttonText="Delete"
                    // onItemClick={closeMenu}
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

                {sessionLinks}
            </div>
        </>
    )
}

export default Post