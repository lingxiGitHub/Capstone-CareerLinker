import "./Post.css"
import OpenModalButton from "../OpenModalButton"
import EditPostModal from "../EditPostModal"
import { useDispatch, useSelector } from "react-redux";
import DeletePost from "../DeletePostModal";

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
                <div>{post.post_user_first_name} {post.post_user_last_name}</div>

                <div>{post.post_content}</div>
                <img className="indi-post-photo" src={post.post_photo} alt=""></img>
                <div>{post.updated_at}</div>

                {sessionLinks}
            </div>
        </>
    )
}

export default Post