import "./EditMessage.css"
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';
import { getSingleMessage, updateMessageThunk } from "../../store/message";


export default function EditMessageComponent({ message, conversationId }) {

    console.log("hey conver id", conversationId)
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const [message_content, setMessage_content] = useState(message.message_content)

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedMessage = {
            messageId: message.message_id,
            user_id: Number(message.message_user_id),
            coversation_id: conversationId,
            message_content,
        }

        if (message_content.length > 1000) {
            setErrors([
                "Message must be less than 1000 characters"
            ])
            return
        }

        const data = await dispatch(updateMessageThunk(updatedMessage, conversationId))
        if (data && data.errors) setErrors(data.errors)

        // history.push(`/home`)
        await closeModal()
        dispatch(getSingleMessage(conversationId))
        // dispatch(getAllPosts())
        // dispatch(getAllComments()) 
    }
    return (
        <>
            <h2 className="edit-message-text">Edit Message</h2>
            <hr></hr>

            <form
                className="update-message-form"
                onSubmit={handleUpdate}
            >

                <ul>
                    {errors.map((error, idx) => (
                        <li class="error-red" key={idx}>{error}</li>
                    ))}
                </ul>

                <label>

                    <input
                        type="text"
                        value={message_content}
                        onChange={(e) => setMessage_content(e.target.value)}


                    />

                </label>

                <button className="update-message-button" type="submit">Update</button>

            </form>

        </>
    )
}