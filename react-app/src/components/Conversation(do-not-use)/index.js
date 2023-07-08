// import "./Conversation.css"
// import { useDispatch, useSelector } from "react-redux";

// export default function Conversation({ conversation }) {

//     const sessionUser = useSelector(state => state.session.user)
//     // console.log("!!!", conversation)
//     return (
//         <div className="message-container">

//             {conversation.messages.map(message => {

//                 // console.log(message)
//                 // console.log(Object.keys(message)[0])
//                 if (+Object.keys(message)[0] == sessionUser.id) {
//                     return (

//                         <div className="my-message">{Object.values(message)}</div>
//                     )
//                 } else {
//                     return (
//                         <div className="other-message">{Object.values(message)}</div>
//                     )
//                 }

//             }

//             )
//             }
//         </div>
//     )
// }
