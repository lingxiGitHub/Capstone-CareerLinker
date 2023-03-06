import "./ShowConversations.css"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react"
import { getAllConversations, getCurrentUserConversations } from "../../../store/conversation";
import ShowMessageComp from "../ShowMessage";
import { Link, NavLink } from "react-router-dom";




export default function ShowConversations() {

    const sessionUser = useSelector(state => state.session.user);

    const allConversationObj = useSelector((state) => {
        return state.conversations.currentConversations
    })

    const allConversation = allConversationObj ? Object.values(allConversationObj) : []
  
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllConversations())
        dispatch(getCurrentUserConversations())

            .then(() => setIsLoaded(true));
    }, [dispatch])

    return (
        isLoaded && (
            <div className="message-middle">
                <div className="messaging-word">Messaging</div>
                <div >

                    {allConversation.map(conversation => {
                        // console.log("@@@@@", conversation)
                        return (
                            <div className="conversation-div">
                              
                                <Link className="conversation-person-div" to={`/messaging/${conversation.conversation_id}`}>
                                    <img className="profile-photo" src={conversation.user_profile_photo} alt=""></img>
                                    <h3 className="conversation-other-name">{conversation.user_first_name} {conversation.user_last_name}</h3>
                                    {/* <div>last message</div>
                                    <div>last message updated</div> */}
                                    {/* {conversation.conversation_id} */}
                                </Link>
                                {/* <ShowMessageComp /> */}
                            </div>
                        )

                    })}
                </div>
            </div>
        )
    )
}