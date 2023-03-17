

//load all posts
const LOAD = "posts/loadPosts"
export const loadPost = (list) => ({
    type: LOAD,
    allPosts: list
})

export const getAllPosts = () => async dispatch => {
    const response = await fetch("/api/posts")
    if (response.ok) {
        // console.log("post fetch response", response)
        const listObj = await response.json()
        const list = listObj.posts
        dispatch(loadPost(list))
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            // console.log("%%%%", data.errors)
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
}

// create a post
const ADD_POST = "posts/addPosts"

export const createPost = (newPost) => ({
    type: ADD_POST,
    newPost
})

export const addPostThunk = (newPost) => async dispatch => {
    // let createdRestaurantId;
    // console.log("I am in addRestaurantThunk")
    const response = await fetch("/api/posts/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    });
    if (response.ok) {
        const createdPost = await response.json()
        // console.log("createdPost", createdPost)
        // createdRestaurantId = createdRestaurant.id
        // console.log("createdRestaurantId", createdRestaurantId)
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            // console.log("%%%%",data.errors)
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
}

//edit a post
const UPDATE_POST = "posts/updatePost"

export const updatePost = (post) => ({
    type: UPDATE_POST,
    post
})

export const updatePostThunk = (post) => async dispatch => {
    // console.log("post at update post thunk", post)
    const {
        id,
        user_id,
        post_content,
        post_photo
    } = post

    const res = await fetch(`/api/posts/${+id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            user_id,
            post_content,
            post_photo
        })
    })

    if (res.ok) {
        // console.log("edit post thunk res is ok", res)
        const updatedPost = await res.json()
        // console.log("%%%%%%%%updatedPost", updatedPost)
        dispatch(updatePost(updatedPost))
        dispatch(getAllPosts())
        return updatedPost
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            // console.log("%%%%", data.errors)
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
}


//delete a post
const DELETE_POST = "posts/deletePost"
export const deletePost = (id) => ({
    type: DELETE_POST,
    id
})

export const deletePostThunk = (id) => async dispatch => {

    const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deletePost(id))
        dispatch(getAllPosts())
    }

}

//reducer
const initialState = {};

export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            const newAllPosts = {}
            action.allPosts.forEach(post => {

                return newAllPosts[post.post_id] = post
            })

            return {
                ...state,
                allPosts: {
                    ...newAllPosts
                }
            }

        case ADD_POST: {
            const addPostState = { ...state }
            // console.log("look at update reducer", addPostState)
            addPostState.allPosts[action.post.id] = action.post
            // console.log("look")
            // console.log("updateSpotState",updateSpotState)
            return addPostState
        }

        case UPDATE_POST: {
            const updatePostState = { ...state }
            // console.log("look at update reducer", updatePostState)
            updatePostState.allPosts[action.post.id] = action.post
            // console.log("look")
            // console.log("updateSpotState",updateSpotState)
            return updatePostState
        }

        case DELETE_POST: {
            const deletePostState = { ...state }
            // console.log(deletePostState)
            // delete deletePostState.allPosts[action.post.id]
            return deletePostState
        }

        default:
            return state;
    }


}