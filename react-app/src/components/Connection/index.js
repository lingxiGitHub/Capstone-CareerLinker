import "./Connection.css"
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllConnections } from "../../store/connection";

export default function ConnectionComponent() {

    const [isLoaded, setIsLoaded] = useState(false);
    const allConnectionsObj = useSelector((state) => {
        return state.connections.allConnections
    })

    const allConnections = allConnectionsObj ? Object.values(allConnectionsObj) : []

    const dispatch = useDispatch()
    useEffect(() => {
        // dispatch(getAllPosts())
        // dispatch(getAllComments())
        // dispatch(getAllLikes())
        dispatch(getAllConnections())
            .then(() => setIsLoaded(true));
    }, [dispatch])

    return (
        <div className="connections-container">
            <div className="connection-count-top">{allConnections.length} Connections</div>
            <hr className="connection-hr"></hr>
            <ul className="connection-ul">
                {allConnections.map((connection => {
                    // console.log(connection)
                    return (
                        <li className="indi-connection-li">
                            <div className="connection-left">
                                <img className="profile-photo" src={connection.profile_photo} alt=""></img>
                                <div>
                                    <div className="connection-name">{connection.first_name} {connection.last_name}</div>
                                    <div className="connection-title">{connection.title}</div>
                                </div>
                            </div>
                            <div className="connection-buttons">
                                <button className="message-button">Message</button>
                                <button>Remove</button>
                         
                            </div>




                        </li>
                    )

                }))}


            </ul>
        </div>
    )

}