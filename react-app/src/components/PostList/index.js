import "./PostList.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getAllPosts } from "../../store/post";
import { getAllComments } from "../../store/comment";
import Post from "../Post";
import AddPostModal from "../AddPostModal";
import OpenModalButton from "../OpenModalButton";
import { getAllLikes } from "../../store/like";
import { getAllConnections } from "../../store/connection";
import banner from "./banner.png";
import NewsRight from "../NewsRight";

function PostList() {
  const sessionUser = useSelector((state) => state.session.user);

  const allPostsObj = useSelector((state) => {
    return state.posts.allPosts;
  });

  const allPosts = allPostsObj ? Object.values(allPostsObj) : [];

  const allConnectionsObj = useSelector((state) => {
    return state.connections.allConnections;
  });

  const allConnections = allConnectionsObj
    ? Object.values(allConnectionsObj)
    : [];

  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(async () => {
    await dispatch(getAllPosts());
    await dispatch(getAllComments());
    await dispatch(getAllLikes());
    await dispatch(getAllConnections());
    setIsLoaded(true);
  }, [dispatch]);

  const premiumSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="premium-svg"
      viewBox="0 0 24 24"
      data-supported-dps="24x24"
      class="mercado-match"
      width="16"
      height="16"
      focusable="false"
    >
      <path
        d="M20 20a3.36 3.36 0 001-2.39V6.38A3.38 3.38 0 0017.62 3H6.38A3.36 3.36 0 004 4z"
        fill="#f8c77e"
      ></path>
      <path
        d="M4 4a3.36 3.36 0 00-1 2.38v11.24A3.38 3.38 0 006.38 21h11.24A3.36 3.36 0 0020 20z"
        fill="#e7a33e"
      ></path>
    </svg>
  );

  return (
    isLoaded && (
      <div className="home-post-container">
        {sessionUser && (
          <div className="left-card">
            <img className="banner" src={banner} alt=""></img>
            <img
              className="profile-photo-72"
              src={sessionUser.profile_photo}
              alt=""
            ></img>
            <div className="left-card-name">
              {sessionUser.first_name} {sessionUser.last_name}
            </div>
            <div className="left-card-title">{sessionUser.title}</div>

            <hr className="left-card-line"></hr>

            <div className="left-card-span">
              <div className="grow-network">
                <span className="span-one">Connections</span>
                <span>Grow your newtwork</span>
              </div>

              <a className="span-two" href="/mynetwork">
                {allConnections.length}
              </a>
            </div>
            <hr className="left-card-line"></hr>
            <a
              className="premium-features"
              target="_blank"
              href="https://premium.linkedin.com"
              rel="noreferrer"
            >
              <h3 className="access-premium">
                Access exclusive tools & insights
              </h3>
              <span>
                <div className="premium-line">
                  {premiumSVG} Try Premium for free
                </div>
              </span>
            </a>
          </div>
        )}

        <div className="home-middle">
          {sessionUser && (
            <div className="create-post-container">
              <div className="create-post-section">
                <img
                  className="profile-photo"
                  src={sessionUser.profile_photo}
                  alt=""
                ></img>
                <OpenModalButton
                  className="start-a-post-button"
                  buttonText="Start a post"
                  modalComponent={<AddPostModal />}
                />
              </div>
            </div>
          )}
          {sessionUser && <hr className="the-line"></hr>}

          <ul className="post-main-ul">
            {allPosts.reverse().map((post) => {
              return (
                <li key={post.post_id}>
                  <Post post={post} />
                </li>
              );
            })}
          </ul>
        </div>

        {sessionUser && <NewsRight />}
      </div>
    )
  );
}

export default PostList;
