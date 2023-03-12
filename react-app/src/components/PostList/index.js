import "./PostList.css"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react"
import { getAllPosts } from "../../store/post";
import { getAllComments } from "../../store/comment";
import Post from "../Post";
import AddPostModal from "../AddPostModal"
import OpenModalButton from "../OpenModalButton"
import { getAllLikes } from "../../store/like";

function PostList() {
    const [showLess, setShowLess] = useState(true);
    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser)

    const allPostsObj = useSelector((state) => {
        return state.posts.allPosts
    })

    // console.log(allPostsObj)
    const allPosts = allPostsObj ? Object.values(allPostsObj) : []

    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllPosts())
        dispatch(getAllComments())
        dispatch(getAllLikes())
            .then(() => setIsLoaded(true));
    }, [dispatch])


    const arrowDownSVG = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
        <path d="M1 5l7 4.61L15 5v2.39L8 12 1 7.39z"></path>
    </svg>)

    const arrowUpSVG = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
        <path d="M15 11L8 6.39 1 11V8.61L8 4l7 4.61z"></path>
    </svg>)


    return (
        isLoaded && (


            <div className="home-post-container">


                {sessionUser && (
                    <div className="left-card">
                        <div className="premium">PREMIUM</div>
                        <div>cover photo</div>
                        <img className="profile-photo-72" src={sessionUser.profile_photo} alt=""></img>
                        <div className="left-card-name">{sessionUser.first_name} {sessionUser.last_name}</div>
                        <div className="left-card-title">{sessionUser.title}</div>
                        {/* <div className="connection-count">
                            <div className="left-card-connections">Connections</div>
                            <div>Num</div> */}
                        {/* </div> */}
                        <hr className="left-card-line"></hr>
                        <div>See Premium features</div>
                        <hr className="left-card-line"></hr>
                    </div>
                )}


                <div className="home-middle">
                    <div>
                        {sessionUser && (
                            <div className="create-post-section">

                                <img className="profile-photo" src={sessionUser.profile_photo} alt=""></img>
                                <OpenModalButton
                                    className="start-a-post-button"
                                    buttonText="Start a post"
                                    modalComponent={<AddPostModal />}
                                />

                            </div>
                        )}

                    </div>
                    <hr className="the-line"></hr>
                    <ul className="post-main-ul">
                        {
                            allPosts.reverse().map(post => {
                                // console.log("post has id?",post)
                                return (

                                    <li key={post.post_id}>
                                        <Post post={post} />
                                    </li>
                                )

                            })
                        }
                    </ul>
                </div>
                <div className="home-right" >
                    <div className={`${showLess ? "show-less" : ""}`}>
                        <div className="linkedin-news">Linkedin News</div>
                        <div className="news-bold"> ◦ JPMorgan embraces Florida, Texas</div>
                        <div className="news-slim">6h ago · 121,043 readers</div>
                        <div className="news-bold">◦ FTC digs deeper into Twitter</div>
                        <div className="news-slim">4h ago · 78,080 readers</div>
                        <div className="news-bold">◦ Payrolls jumped recently: ADP</div>
                        <div className="news-slim">6h ago · 31,045 readers</div>
                        <div className="news-bold">◦ New vaccine proves effective against Delta</div>
                        <div className="news-slim">6h ago · 21,542 readers</div>
                        <div className="news-bold">◦ Apple unveils latest iPhone model</div>
                        <div className="news-slim">6h ago · 19,031 readers</div>
                        <div className="news-bold">◦ New study links coffee to longer lifespan</div>
                        <div className="news-slim">6h ago · 17,983 readers</div>
                        <div className="news-bold">◦ NASA to launch new Mars rover mission</div>
                        <div className="news-slim">6h ago · 5,728 readers</div>
                        <div className="news-bold">◦ World Leaders Meet to Discuss Climate Crisis</div>
                        <div className="news-slim">6h ago · 2,333 readers</div>
                        <div className="news-bold">◦ SpaceX Launches Mission to Mars</div>
                        <div className="news-slim">6h ago · 1,003 readers</div>
                        <div className="news-bold">◦ China's Economy Continues to Grow</div>
                        <div className="news-slim">6h ago · 566 readers</div>


                    </div>
                    <button
                        className="show-less-news"
                        onClick={e => setShowLess(!showLess)}
                    >{showLess ? (
                        <span>Show More {arrowDownSVG}</span>
                    ) : (
                        <span>Show Less {arrowDownSVG}</span>
                    )}</button>
                </div>
            </div>

        )
    )


}

export default PostList
