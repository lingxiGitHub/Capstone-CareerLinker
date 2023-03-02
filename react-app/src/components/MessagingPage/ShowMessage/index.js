
import "./ShowMessage.css"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getSingleMessage } from "../../../store/message";
import { useParams } from 'react-router-dom';

export default function ShowMessageComp() {

    let { conversationId } = useParams()
    // console.log("conversation id", conversationId)

    const sessionUser = useSelector(state => state.session.user);

    const singleMessageObj = useSelector((state) => {
        return state.messages.singleMessage
    })

    const singleMessage = singleMessageObj ? Object.values(singleMessageObj) : []

    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch()

    let intervalId
    useEffect(() => {
        if (intervalId) {
            clearInterval(intervalId)
        }

        // dispatch(getSingleMessage(conversationId))
        //     .then(() => setIsLoaded(true));


        intervalId = setInterval(() => {
            dispatch(getSingleMessage(conversationId))
                .then(() => setIsLoaded(true));
        }, 1000);

        return () => clearInterval(intervalId)
     }, [dispatch, conversationId])

    return (

        isLoaded && (
            <div className="loading-message">
                <div>loading message here</div>
                {singleMessage.map(message => {
                    return (
                        <div className="message-line">
                            {message.message_content}
                        </div>
                    )
                })}
            </div>
        )
    )






}