
import "./ShowMessage.css"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getSingleMessage } from "../../../store/message";
import { useParams } from 'react-router-dom';
import CreateMessageBox from "../../CreateMessage";
import { createRef } from "react";
import DeleteMessage from "../../DeleteMessage";
import EditMessageComponent from "../../EditMessage";
import OpenModalButton from "../../OpenModalButton";
import MessageThreeDots from "../../MessageThreeDots";


export default function ShowMessageComp() {

    const messageContainerRef = createRef()
    let { conversationId } = useParams()
    // console.log("conversation id", conversationId)

    const sessionUser = useSelector(state => state.session.user);

    const singleMessageObj = useSelector((state) => {
        return state.messages.singleMessage
    })

    const singleMessage = singleMessageObj ? Object.values(singleMessageObj) : []

    // console.log("-->", singleMessage)

    let otherPersonName;
    let otherPersonTitle;

    for (let item of singleMessage) {
        if (item.message_user_id != sessionUser.id) {
            otherPersonName = item.message_user_first_name + " " + item.message_user_last_name;
            otherPersonTitle = item.message_user_title
        }
    }

    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch()

    let intervalId
    useEffect(() => {
        if (intervalId) {
            clearInterval(intervalId)
        }


        //**************turn off the fetch********************** */
        dispatch(getSingleMessage(conversationId))
            .then(() => {
                setIsLoaded(true)
            });



        //**************turn on the fetch********************** */

        // intervalId = setInterval(() => {
        //     dispatch(getSingleMessage(conversationId))
        //         .then(() => setIsLoaded(true));
        // }, 1000);

        // return () => clearInterval(intervalId)


        // **************turn on the fetch********************** */
    }, [dispatch, conversationId])

    return (

        isLoaded && sessionUser && (
            <div className="loading-message">

                <div className="top-section-word">
                    <div className="top-other-person-name">{otherPersonName}</div>
                    <div className="top-other-person-title">{otherPersonTitle}</div>
                </div>
                <div
                    ref={messageContainerRef}
                    className="message-container">

                    {singleMessage.map(message => {
                        // console.log("$$$$", message)

                        return (
                            <div className="other-message">
                                <div>{message.message_user_first_name} {message.message_user_last_name}</div>
                                <img className="profile-photo" src={message.message_user_profile_photo} alt=""></img>
                                <div>{message.message_updated_at}</div>

                                {message.message_user_id == sessionUser.id && (

                                    <div className="message-three-dots">
                                        <MessageThreeDots
                                            messageId={message.message_id}
                                            conversationId={conversationId}
                                            message={message}
                                        />
                                    </div>


                                )}

                                <div>{message.message_content}</div>

                            </div>)


                    })}


                </div>
                <CreateMessageBox conversationId={conversationId} />
            </div>
        )
    )






}