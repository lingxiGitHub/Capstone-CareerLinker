import "./CreateMessage.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessageThunk,
  getAllMessages,
  getSingleMessage,
} from "../../store/message";
import { useHistory } from "react-router-dom";

export default function CreateMessageBox({ conversationId }) {
  const dispatch = useDispatch();
  // const [messageDraft, setMessageDraft] = useState("");
  const [message_content, setMessage_content] = useState("");
  const sessionUser = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMessage = {
      user_id: sessionUser.id,
      conversation_id: conversationId,
      message_content,
    };

    if (message_content.length > 500) {
      setErrors(["message must be less than 500 characters"]);
      return;
    }

    const data = await dispatch(addMessageThunk(newMessage));
    if (data && data.errors) setErrors(data.errors);

    history.push(`/messaging/${conversationId}`);
    setMessage_content("");
    await dispatch(getSingleMessage(conversationId));

    const messageContainerElement =
      document.querySelector(".message-container");
    messageContainerElement &&
      messageContainerElement.scrollTo(0, messageContainerElement.scrollHeight);
  };

  return (
    <>
      <form className="create-message-form" onSubmit={handleSubmit}>
        {errors.length > 0 ? (
          <ul>
            {errors.map((error, idx) => (
              <li class="error-red" key={idx}>
                {error}
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}

        <hr className="hr-above-box"></hr>
        <textarea
          className="message-input-box"
          placeholder="Write a message..."
          type="text"
          value={message_content}
          onChange={(e) => setMessage_content(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          required
        />
        <button className="submit-message-button" type="submit">
          Send
        </button>
      </form>
    </>
  );
}
