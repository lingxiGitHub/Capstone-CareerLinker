import "./Reaction.css";

export default function ReactionModal({ myLikes }) {
  return (
    <div className="display-liked-users-container">
      <h2>Reactions</h2>
      <div className="model-likes-count">
        <img
          alt=""
          src="https://static.licdn.com/sc/h/2uxqgankkcxm505qn812vqyss"
        ></img>
        <span className="modal-like-span"> {myLikes.length} likes</span>
      </div>
      <hr id="open-like-hr"></hr>
      <ul className="liked-users-list">
        {myLikes.map((user) => {
          return (
            <li className="indi-liked-user">
              <img
                className="liked-user-photo"
                src={user.user_profile_photo}
                alt=""
              ></img>
              <div className="liked-user-name-title">
                <div className="liked-user-name">
                  {user.user_first_name} {user.user_last_name}
                </div>
                <div className="liked-user-title">{user.user_title}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
