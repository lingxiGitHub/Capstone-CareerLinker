import "./DeleteComment.css";
import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { deleteCommentThunk, getAllComments } from "../../store/comment";
import { getAllPosts } from "../../store/post";

export default function DeleteCommentComponent({ post, comment }) {
  const postId = post.post_id;
  const commentId = comment.comment_id;

  const dispatch = useDispatch();
  const history = useHistory();

  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteCommentThunk(postId, commentId))
      .then(() => dispatch(getAllPosts()))
      .then(() => dispatch(getAllComments()))
      .then(() => closeModal())
      .then(() => history.push("/home"));
  };

  return (
    <form className="delete-comment-confirmation-form">
      <h3 className="confirm-delete-comment">Confirm Delete?</h3>
      <button className="yes-delete-comment-button" onClick={handleDelete}>
        Yes
      </button>
    </form>
  );
}
