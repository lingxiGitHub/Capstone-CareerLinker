import "./DeleteMessage.css";
import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { deleteMessageThunk } from "../../store/message";
import { getSingleMessage } from "../../store/message";

export default function DeleteMessageComponent({ messageId, conversationId }) {

  const dispatch = useDispatch();
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
