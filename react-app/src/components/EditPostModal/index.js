import "./EditPost.css"
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { updatePostThunk, getAllPosts } from "../../store/post";
import { useHistory } from 'react-router-dom';

function EditPostModal({ post }) {

    // console.log("post in edit modal", post)
    // console.log("post user id in edit modal", post.post_user_id)

    const dispatch = useDispatch();
    const history = useHistory();

    const [post_content, setPost_content] = useState(post.post_content)
    const [post_photo, setPost_photo] = useState(post.post_photo)

    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedPost = {
            id: post.post_id,
            user_id: Number(post.post_user_id),
            post_content,
            post_photo,

        }

        if (post_content.length > 1000) {
            setErrors([
                "post must be less than 1000 characters"
            ])
            return
        }

        const data = await dispatch(updatePostThunk(updatedPost))
        if (data && data.errors) setErrors(data.errors)

        history.push(`/home`)
        dispatch(getAllPosts())
        closeModal()

    }

    // const sessionUser = useSelector(state => state.session.user);

    // let sessionLinks;


    return (
        <>
            <h2 className="edit-post-text">Edit Post</h2>
            <hr></hr>
            <form
                className="update-post-form"
                onSubmit={handleUpdate}
            >

                <ul>
                    {errors.map((error, idx) => (
                        <li class="error-red" key={idx}>{error}</li>
                    ))}
                </ul>

                <label>
                    <span>Post</span>
                    <textarea
                        type="text"
                        value={post_content}
                        onChange={(e) => setPost_content(e.target.value)}
                        required

                    />

                </label>

                <label>
                    <span>Post Photo</span>
                    <input
                        type="text"
                        value={post_photo}
                        onChange={(e) => setPost_photo(e.target.value)}


                    />

                </label>

                <button className="update-button" type="submit">Update</button>



            </form>


        </>
    )
}

export default EditPostModal
