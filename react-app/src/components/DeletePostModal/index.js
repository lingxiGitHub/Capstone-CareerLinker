import "./DeletePost.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { deletePostThunk, getAllPosts } from "../../store/post";

export default function DeletePost({ post }) {
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
      .then(() => history.push("/home"));
  };

  return (
    <>
      <form>
        <h3 className="confirm">Confirm Delete?</h3>
        <button className="yes-button" onClick={handleDelete}>
          Yes
        </button>
      </form>
    </>
  );
}
