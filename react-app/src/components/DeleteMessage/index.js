import "./DeleteMessage.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { deletePostThunk, getAllPosts } from "../../store/post";
import { deleteMessageThunk } from "../../store/message";
import { getSingleMessage } from "../../store/message";

export default function DeleteMessageComponent({ messageId, conversationId }) {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteMessageThunk(messageId, conversationId));
    await closeModal();
    dispatch(getSingleMessage(conversationId));
  };

  return (
    <>
      <form>
        <h3 className="confirm">Confirm Delete Message?</h3>
        <button className="yes-button" onClick={handleDelete}>
          Yes
        </button>
      </form>
    </>
  );
}
