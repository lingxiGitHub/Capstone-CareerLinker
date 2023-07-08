import "./ShowMessage.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getSingleMessage } from "../../../store/message";
import { useParams } from "react-router-dom";
import CreateMessageBox from "../../CreateMessage";
import { createRef } from "react";
import DeleteMessage from "../../DeleteMessage";
import EditMessageComponent from "../../EditMessage";
import OpenModalButton from "../../OpenModalButton";
import MessageThreeDots from "../../MessageThreeDots";

export default function ShowMessageComp() {
  const messageContainerRef = createRef();
  let { conversationId } = useParams();

  const sessionUser = useSelector((state) => state.session.user);

  const singleMessageObj = useSelector((state) => {
    return state.messages.singleMessage;
  });

  const singleMessage = singleMessageObj ? Object.values(singleMessageObj) : [];

  let otherPersonName;
  let otherPersonTitle;

  for (let item of singleMessage) {
    if (item.message_user_id != sessionUser.id) {
      otherPersonName =
        item.message_user_first_name + " " + item.message_user_last_name;
      otherPersonTitle = item.message_user_title;
    }
  }

  const [isLoaded, setIsLoaded] = useState(false);
  const [pollingEnabled, setPollingEnabled] = useState(false);

  const dispatch = useDispatch();

  let intervalId;
  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    if (pollingEnabled) {
      intervalId = setInterval(() => {
        dispatch(getSingleMessage(conversationId)).then(() =>
          setIsLoaded(true)
        );
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      dispatch(getSingleMessage(conversationId)).then(() => {
        setIsLoaded(true);
      });
    }
    //**************turn off the fetch********************** */

    //**************turn on the fetch********************** */

    // intervalId = setInterval(() => {
    //     dispatch(getSingleMessage(conversationId))
    //         .then(() => setIsLoaded(true));
    // }, 1000);

    // return () => clearInterval(intervalId)

    // **************turn on the fetch********************** */
  }, [dispatch, pollingEnabled, conversationId]);

  return (
    isLoaded &&
    sessionUser && (
      <div className="loading-message">
        <div className="message-top-right">
          {singleMessage.length === 0 ? (
            <div className="top-section-word">
              <div className="top-other-person-name">New message</div>
              <div className="top-other-person-title">
                Choose a connection to start a conversation
              </div>
            </div>
          ) : (
            <div className="top-section-word">
              <div className="top-other-person-name">{otherPersonName}</div>
              <div className="top-other-person-title">{otherPersonTitle}</div>
            </div>
          )}

          <input
            // className="toggle-input"
            type="checkbox"
            id="switch"
            onChange={(e) => setPollingEnabled(!pollingEnabled)}
          />
          <label className="toggle-label" for="switch">
            Toggle
          </label>
        </div>

        <div ref={messageContainerRef} className="message-container">
          {singleMessage.map((message) => {
            // console.log("$$$$", message)

            return (
              <div className="message-card">
                <img
                  className="message-photo"
                  src={message.message_user_profile_photo}
                  alt=""
                ></img>

                <div className="message-right">
                  <div className="message-first-line">
                    <div className="name-and-time">
                      <div className="message-user-name">
                        {message.message_user_first_name}{" "}
                        {message.message_user_last_name}
                      </div>
                      <div className="message-time">
                        {new Date(message.message_updated_at).toLocaleString()}
                      </div>
                    </div>

                    {message.message_user_id == sessionUser.id && (
                      <div className="message-three-dots">
                        <MessageThreeDots
                          messageId={message.message_id}
                          conversationId={conversationId}
                          message={message}
                        />
                      </div>
                    )}
                  </div>

                  <div className="message-content-font">
                    {message.message_content}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="empty-spacer"></div>
        </div>
        <CreateMessageBox conversationId={conversationId} />
      </div>
    )
  );
}
