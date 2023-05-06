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
    const [photoError, setPhotoError] = useState(false)
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const sessionUser = useSelector(state => state.session.user)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            user_id: sessionUser.id,
            post_content,
            post_photo
        }

        if (post_content.length > 1000) {
            setErrors([
                "post must be less than 1000 characters"
            ])
            return
        }

        const data = await dispatch(addPostThunk(newPost))
        if (data && data.errors) {
            setErrors(data.errors)
            return
        }
        if (post_photo && photoError) {
            setErrors(["invalid photo"])
            return
        }

        history.push(`/home`)
        closeModal()
        dispatch(getAllPosts())

    }

    return (
        <div className="create-post-modal-border">
            {/* <h2 className="create-a-post-text">Create a post</h2> */}
         
            <div className="post-above">
                <img className="profile-photo" src={sessionUser.profile_photo} alt=""></img>
                <div className="create-post-user-name">{sessionUser.first_name} {sessionUser.last_name}</div>
            </div>


            <form
                className="create-post-form"
                onSubmit={handleSubmit}
            >

                <ul>
                    {errors.map((error, idx) => (
                        <li class="error-red" key={idx}>{error}</li>
                    ))}
                </ul>

                <label>
                    {/* <span>Post</span> */}
                    <textarea
                        className="post-text-area"
                        type="text"
                        value={post_content}
                        placeholder="What do you want to talk about?"
                        onChange={(e) => setPost_content(e.target.value)}
                        required

                    />

                </label>

                <label>
                    <span className="photo-url">photo url (optional)</span>
                    <input
                        className="photo-url-place"
                        type="text"
                        value={post_photo}
                        onChange={(e) => { setPhotoError(false); setPost_photo(e.target.value); }}


                    />
                    {/* {photoError && (
                        <div>Invalid image url</div>
                    )} */}
                    <img className="hidden-broken-image" src={post_photo}
                        onError={e => setPhotoError(true)}
                    />
                </label>

                <button className="post-submit-button" type="submit">Post</button>

            </form>

        </div>
    )

}

export default AddPostModal