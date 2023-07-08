import ShowConversations from "./ShowConversations";
import ShowMessageComp from "./ShowMessage";
import "./MessagingPage.css";

export default function MessagingPage() {
  return (
    <div className="messaging-page">
      <div className="conversation-list">
        <ShowConversations />
      </div>
      {/* <div className="message-list"> */}
      <ShowMessageComp />
      {/* </div> */}
    </div>
  );
}
