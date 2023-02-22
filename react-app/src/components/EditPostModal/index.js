import "./EditPost.css"
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';
import { updatePostThunk } from "../../store/post";

function EditPostModal({ post }) {

    // console.log("post in edit modal", post)
    // console.log("post user id in edit modal", post.post_user_id)

    const dispatch = useDispatch();
    const history = useHistory();

    const [post_content, setPost_content] = useState(post.post_content)
    const [post_photo, setPost_photo] = useState(post.post_photo)

    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedPost = {
            id: post.post_id,
            user_id: Number(post.post_user_id),
            post_content,
            post_photo,

        }



        dispatch(updatePostThunk(updatedPost))
            .then(console.log("after update thunk", updatedPost))
            .then(closeModal())
            .catch(
                async (res) => {
                    const data = await res.json();
                    console.log("data", data.errors)
                    if (data && data.errors) setErrors(data.errors);
                }
            )
    }

    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;


    return (
        <>
            <h2>Edit Post</h2>
            <form
                className="update-post-form"
                onSubmit={handleUpdate}
            >

                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
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

                <button type="submit">Post</button>



            </form>


        </>
    )
}

export default EditPostModal
