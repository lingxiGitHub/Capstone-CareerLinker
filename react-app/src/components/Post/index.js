import "./Post.css"

function Post({ post }) {
    return (
        <>
            <div className="indi-post-area">
                <div>{post.post_user_first_name} {post.post_user_last_name}</div>
            
                <div>{post.post}</div>
                <img className="indi-post-photo" src={post.post_photo} alt=""></img>
                <div>{post.updated_at}</div>
            </div>
        </>
    )
}

export default Post