import "./AddPost.css"
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';
import { addPostThunk, getAllPosts } from "../../store/post";

function AddPostModal() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [post_content, setPost_content] = useState("")
    const [post_photo, setPost_photo] = useState("")

    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const sessionUser = useSelector(state => state.session.user)

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            user_id: sessionUser.id,
            post_content,
            post_photo
        }

        return dispatch(addPostThunk(newPost))
            .then(()=>history.push(`/`))
            .then(closeModal())
            .then(()=>dispatch(getAllPosts()))
            .catch(
                async (res) => {
                    const data = await res.json();
                    console.log("data", data.errors)
                    if (data && data.errors) setErrors(data.errors);
                }
            )
    }

    return (
        <>
            <h2>Create a post</h2>
            <img src={sessionUser.profile_photo} alt=""></img>
            <div>{sessionUser.first_name} {sessionUser.last_name}</div>

            <form onSubmit={handleSubmit}>

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

export default AddPostModal