

//load all posts
const LOAD = "posts/loadPosts"
export const loadPost = (list) => ({
    type: LOAD,
    allPosts: list
})

export const getAllPosts = () => async dispatch => {
    const response = await fetch("/api/posts")
    if (response.ok) {
        console.log("post fetch response",response)
        const listObj = await response.json()
        const list = listObj.posts
        dispatch(loadPost(list))
    }else{
        console.log("get all post fetch failed")
    }
}

// create a post
const ADD_POST="posts/addPosts"

export const createPost=(newPost)=>({
    type: ADD_POST,
    newPost
})

export const addPostThunk=(newPost)=>async dispatch=>{
    let createdPostId;
const response=await fetch("api")
}


//

//reducer
const initialState = {};

export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            const newAllPosts = {}
            action.allPosts.forEach(post => {
                console.log(post)
                return newAllPosts[post.post_id] = post
            })

            return {
                ...state,
                allPosts: {
                    ...newAllPosts
                }
            }

        default:
            return state;
    }


}