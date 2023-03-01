
import "./ShowMessage.css"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getAllMessages, getSingleMessage } from "../../../store/message";

export default function ShowMessageComp() {

    const sessionUser = useSelector(state => state.session.user);

    const allMessageObj = useSelector((state) => {
        return state.messages.allMessages
    })

    const allMessage = allMessageObj ? Object.values(allMessageObj) : []
    console.log("%%%%%%%", allMessage)

    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllMessages())
        dispatch(getSingleMessage())

            .then(() => setIsLoaded(true));
    }, [dispatch])

    return (

        isLoaded && (<div className="loading-message">
            <div>loading message here</div>
            {allMessage.map(message => {
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