import "./PostList.css"
import { useEffect } from "react";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react"
import { getAllPosts } from "../../store/post";
import Post from "../Post";

function PostList() {
    const sessionUser = useSelector(state => state.session.user);

    const allPostsObj = useSelector((state) => {
        return state.posts.allPosts
    })

    console.log(allPostsObj)
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

                {
                    allPosts.map(post=>{
                        return (
                            <div key={post.id} to={`/${post.id}`}>
                            <Post post={post}/>
                            </div>
                        )
                    })
                }
            </div>
            </>
        )
    )


}

export default PostList
