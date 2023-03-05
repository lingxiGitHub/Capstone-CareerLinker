import "./AddComment.css"

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory,  } from 'react-router-dom';
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

    const [comment_content, setComment_content] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newComment = {
            user_id: sessionUser.id,
            post_id: postId,
            comment_content,
        }

        if (comment_content.length>500){
            setErrors([
                "Comment must be less than 500 characters"
            ])
            return
        }

        const data = await dispatch(addCommentThunk(newComment, postId))
        if (data && data.errors) setErrors(data.errors)

        history.push(`/home`)
        closeModal()
        dispatch(getAllPosts())
        dispatch(getAllComments())

        // return dispatch(addCommentThunk(newComment, postId))
        //     .then(() => history.push(`/home`))
        //     .then(closeModal())
        //     .then(() => dispatch(getAllPosts()))
        //     .then(() => dispatch(getAllComments()))
        //     .catch(
        //         async (res) => {
        //             const data = await res.json();
        //             console.log("data", data.errors)
        //             if (data && data.errors) setErrors(data.errors);
        //         }
        //     )

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
                        <li class="error-red" key={idx}>{error}</li>
                    ))}
                </ul>

                <label>

                    <input
                        className="comment-text-area"
                        type="text"
                        placeholder="Add a comment..."
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