//load all likes

const LOAD = "likes/loadLikes"
export const loadLike = (likesObj) => ({
    type: LOAD,
    allLikes: likesObj
})

export const getAllLikes = () => async dispatch => {
    const response = await fetch("/api/posts/likes")
    if (response.ok) {
        // console.log("post fetch response", response)
        const likesObj = await response.json()
        // const list = listObj.posts
        dispatch(loadLike(likesObj))
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            console.log("%%%%", data.errors)
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
}


//load likes for a single post

// const LOADSINGLELIKE = "like/loadSingleLike"
// export const loadSingleLike = (likedUsers) => ({
//     type: LOADSINGLELIKE,
//     likedUsers: likedUsers
// })

// export const getSingleLike = (postId) => async dispatch => {

//     const response = await fetch(`/api/posts/${postId}/like`)
//     if (response.ok) {
//         const likedUsers = await response.json()
//         dispatch(loadSingleLike(likedUsers))
//     } else if (response.status < 500) {
//         const data = await response.json();
//         if (data.errors) {
//             console.log("%%%%", data.errors)
//             return data.errors;
//         }
//     } else {
//         return ["An error occurred. Please try again."];
//     }

// }

//reducer

const initialState = {}

export default function likeReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            const newAllLikes = action.allLikes


            return {
                ...state,
                allLikes: {
                    ...newAllLikes
                }
            }
        // case LOADSINGLELIKE:
        //     const newSingleLike = {}
        //     action.users.forEach(user => {
        //         // console.log("single message at store", message)

        //         return newSingleLike[user.user_id] = user
        //     })

        //     return {
        //         ...state,
        //         likedUsers: {
        //             ...newSingleLike
        //         }
        //     }

        // case ADD_MESSAGE: {
        //     const addMessageState = { ...state }
        //     // console.log("look at update reducer", addPostState)
        //     addMessageState.singleMessage[action.message.id] = action.message
        //     // console.log("look")
        //     // console.log("updateSpotState",updateSpotState)
        //     return addMessageState
        // }

        // case UPDATE_MESSAGE: {
        //     const updateMessageState = { ...state }
        //     // console.log("look at update reducer", updatePostState)
        //     updateMessageState.singleMessage[action.message.id] = action.message
        //     // console.log("look")
        //     // console.log("updateSpotState",updateSpotState)
        //     return updateMessageState
        // }

        // case DELETE_MESSAGE: {
        //     const deleteMessageState = { ...state }
        //     // console.log(deletePostState)
        //     // delete deletePostState.allPosts[action.post.id]
        //     return deleteMessageState
        // }
        default:
            return state;
    }
}