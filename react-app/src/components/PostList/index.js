import "./PostList.css"
import { useEffect } from "react";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react"
import { getAllPosts } from "../../store/post";
import Post from "../Post";
import AddPostModal from "../AddPostModal"
import OpenModalButton from "../OpenModalButton"

function PostList() {
    const sessionUser = useSelector(state => state.session.user);

    const allPostsObj = useSelector((state) => {
        return state.posts.allPosts
    })

    // console.log(allPostsObj)
    const allPosts = allPostsObj ? Object.values(allPostsObj) : []

    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllPosts()).then(() => setIsLoaded(true));
    }, [dispatch])

    return (
        isLoaded && (
            <>
                <div>
                    {sessionUser && (

                        <OpenModalButton
                            buttonText="Start a post"
                            modalComponent={<AddPostModal />}
                        />
                    )}

                </div>

                <ul>
                    {
                        allPosts.map(post => {
                            // console.log("post has id?",post)
                            return (

                                <li key={post.post_id}>
                                    <Post post={post} />
                                </li>
                            )

                        })
                    }
                </ul>

            </>
        )
    )


}

export default PostList
