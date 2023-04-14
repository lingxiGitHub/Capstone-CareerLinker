import "./Connection.css"
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllConnections, deleteConnectionThunk } from "../../store/connection";

export default function ConnectionComponent() {

    const [isLoaded, setIsLoaded] = useState(false);
    const allConnectionsObj = useSelector((state) => {
        return state.connections.allConnections
    })

    const allConnections = allConnectionsObj ? Object.values(allConnectionsObj) : []

    const dispatch = useDispatch()
    useEffect(() => {

        dispatch(getAllConnections())
            .then(() => setIsLoaded(true));
    }, [dispatch])

    const removeConnectionSVG = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
        <path d="M20.42 13L23 15.58 21.58 17 19 14.42 16.42 17 15 15.58 17.58 13 15 10.42 16.42 9 19 11.58 21.58 9 23 10.42zM9 2a5 5 0 105 5 5 5 0 00-5-5zm2 12H7a3 3 0 00-3 3v5h10v-5a3 3 0 00-3-3z"></path>
    </svg>)

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
                                {/* <button className="message-button">Message</button> */}
                                <button
                                    className="remove-connection-button"
                                    onClick={() => {
                                        dispatch(deleteConnectionThunk(connection.user_id))
                                    }}
                                >{removeConnectionSVG} <span className="remove-word">Remove</span></button>

                            </div>




                        </li>
                    )

                }))}


            </ul>
        </div>
    )

}