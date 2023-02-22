import "./DeletePost.css"
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';
import { deletePostThunk, getAllPosts } from "../../store/post"

export default function DeletePost({ post }) {

    // console.log("$$$$", post.post_id)
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    let sessionLinks;

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deletePostThunk(+post.post_id))
            .then(() => dispatch(getAllPosts()))
            .then(() => closeModal())
            .then(() => history.push("/"))
    }

    return (
        <>
            <form>
                <h3>Confirm Delete?</h3>
                <button
                    onClick={handleDelete}
                >Yes</button>
            </form>

        </>
    )


}