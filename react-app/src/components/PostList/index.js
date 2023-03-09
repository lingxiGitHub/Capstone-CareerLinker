import "./PostList.css"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react"
import { getAllPosts } from "../../store/post";
import { getAllComments } from "../../store/comment";
import Post from "../Post";
import AddPostModal from "../AddPostModal"
import OpenModalButton from "../OpenModalButton"

function PostList() {
    const sessionUser = useSelector(state => state.session.user);
    console.log(sessionUser)

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
            .then(() => setIsLoaded(true));
    }, [dispatch])

    return (
        isLoaded && (


            <div className="home-post-container">
                <div className="home-left">
                    <div>
                        {sessionUser && (
                            <div className="left-card">
                                <img className="profile-photo" src={sessionUser.profile_photo} alt=""></img>
                                <div>{sessionUser.first_name} {sessionUser.last_name}</div>
                                <div>{sessionUser.title}</div>
                                <div>Connections</div>
                                <div>See Premium features</div>
                            </div>
                        )}
                    </div>
                </div>
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
                <div className="home-right">
                    <div className="linkedin-news">Linkedin News</div>
                    <div className="news-bold">LinkedIn News</div>
                    <div className="news-slim">LinkedIn News</div>
                    <div className="news-bold">LinkedIn News</div>
                    <div className="news-slim">LinkedIn News</div>
                    <div className="news-bold">LinkedIn News</div>
                    <div className="news-slim">LinkedIn News</div>
                    <div className="news-bold">LinkedIn News</div>
                    <div className="news-slim">LinkedIn News</div>
                    <div className="news-bold">LinkedIn News</div>
                    <div className="news-slim">LinkedIn News</div>
                    <button className="show-less-news">Show less</button>

                </div>
            </div>

        )
    )


}

export default PostList
