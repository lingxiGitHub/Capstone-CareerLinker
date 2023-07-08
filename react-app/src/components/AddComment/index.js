import "./AddComment.css";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { addCommentThunk, getAllComments } from "../../store/comment";
import { getAllPosts } from "../../store/post";
import Button from "@mui/material/Button";

function AddComment({ post }) {
  let postId = +post.post_id;
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const sessionUser = useSelector((state) => state.session.user);
  const [comment_content, setComment_content] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newComment = {
      user_id: sessionUser.id,
      post_id: postId,
      comment_content,
    };

    if (comment_content.length > 500) {
      setErrors(["Comment must be less than 500 characters"]);
      return;
    }

    const data = await dispatch(addCommentThunk(newComment, postId));
    if (data && data.errors) setErrors(data.errors);

    await closeModal();
    await dispatch(getAllPosts());
    await dispatch(getAllComments());
    history.push(`/home`);
  };

  return (
    <>
      <h2 className="create-a-comment-text">Create a Comment</h2>
      <hr></hr>

      <form onSubmit={handleSubmit} className="create-comment-form">
        <ul>
          {errors.map((error, idx) => (
            <li class="error-red" key={idx}>
              {error}
            </li>
          ))}
        </ul>

        <label>
          <input
            className="comment-text-area"
            type="text"
            placeholder="Add a comment..."
            value={comment_content}
            onChange={(e) => setComment_content(e.target.value)}
            required
          />
        </label>

        <Button id="comment-submit-button" type="submit" variant="contained">
          Comment
        </Button>
      </form>
    </>
  );
}

export default AddComment;
