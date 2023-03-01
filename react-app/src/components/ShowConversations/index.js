import "./ShowConversations.css"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react"
import { getAllConversations } from "../../store/conversation";




export default function ShowConversations() {

    const sessionUser = useSelector(state => state.session.user);

    const allConversationObj = useSelector((state) => {
        return state.conversations.allConversations
    })



    const allConversation = allConversationObj ? Object.values(allConversationObj) : []


    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllConversations())

            .then(() => setIsLoaded(true));
    }, [dispatch])

    return (
        isLoaded && (
            <div className="message-middle">
                <div>this is conversation list</div>

                <div>

                    {allConversation.map(conversation => {
                        console.log("@@@@@", conversation)
                        return (
                            <div>{conversation.conversation_id}</div>
                        )

                    })}
                </div>
            </div>
        )
    )
}