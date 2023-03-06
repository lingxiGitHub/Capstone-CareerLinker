import "./EditComment.css"

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';
import { updateCommentThunk } from "../../store/comment";
import { getAllComments } from "../../store/comment";
import { getAllPosts } from "../../store/post";
function EditComment({ post, comment }) {

    // console.log("***post",post)
    // console.log("****comment",comment)

    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);

    const [comment_content, setComment_content] = useState(comment.comment_content)
    const { closeModal } = useModal();

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedComment = {
            id: comment.comment_id,
            user_id: Number(comment.comment_user_id),
            post_id: Number(comment.comment_post_id),
            comment_content,
        }

        if (comment_content.length > 500) {
            setErrors([
                "Comment must be less than 500 characters"
            ])
            return
        }

        const data = await dispatch(updateCommentThunk(updatedComment, post.post_id, comment.comment_id))
        if (data && data.errors) setErrors(data.errors)

        history.push(`/home`)
        closeModal()
        dispatch(getAllPosts())
        dispatch(getAllComments())


        // dispatch(updateCommentThunk(updatedComment, post.post_id, comment.comment_id))
        //     .then(closeModal())
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
            <h2 className="edit-comment-text">Edit Comment</h2>
            <hr></hr>

            <form
                className="update-comment-form"
                onSubmit={handleUpdate}
            >

                <ul>
                    {errors.map((error, idx) => (
                        <li class="error-red" key={idx}>{error}</li>
                    ))}
                </ul>

                <label>

                    <textarea
                        type="text"
                        value={comment_content}
                        onChange={(e) => setComment_content(e.target.value)}


                    />

                </label>

                <button className="update-comment-button" type="submit">Update</button>





            </form>

        </>
    )



}

export default EditComment