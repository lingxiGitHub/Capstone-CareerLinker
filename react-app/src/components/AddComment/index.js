import "./AddComment.css"

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory, useParams } from 'react-router-dom';
import { addCommentThunk, getAllComments } from "../../store/comment";
import { getAllPosts } from "../../store/post";


function AddComment({ post }) {
    //how to get the post id for comments
    let postId = +post.post_id
    // console.log("&&&", postId)

    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const sessionUser = useSelector(state => state.session.user)

    const [comment_content, setComment_content] = useState("Add a comment...")


    const handleSubmit = (e) => {
        e.preventDefault();

        const newComment = {
            user_id: sessionUser.id,
            post_id: postId,
            comment_content,
        }

        return dispatch(addCommentThunk(newComment, postId))
            .then(() => history.push(`/`))
            .then(closeModal())
            .then(() => dispatch(getAllPosts()))
            .then(() => dispatch(getAllComments()))
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
            <h2 className="create-a-comment-text">Create a Comment</h2>
            <hr></hr>

            <form
                onSubmit={handleSubmit}
                className="create-comment-form"
            >

                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>

                <label>

                    <input
                        className="comment-text-area"
                        type="text"
                        value={comment_content}
                        onChange={(e) => setComment_content(e.target.value)}


                    />

                </label>

                <button className="comment-submit-button" type="submit">Post</button>



            </form>

        </>
    )




}

export default AddComment