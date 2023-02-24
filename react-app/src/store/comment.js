import { getAllPosts } from "./post"


//load all comments
const LOAD = "comments/loadComments"
export const loadComment = (list) => ({
    type: LOAD,
    allComments: list
})

export const getAllComments = () => async dispatch => {
    // console.log("???")
    const response = await fetch("/api/comments")
    if (response.ok) {
        // console.log("comment fetch response", response)
        const listObj = await response.json()
        const list = listObj.comments
        dispatch(loadComment(list))
    } else {
        console.log("get all comment fetch failed")
    }
}

//create comment
const ADD_COMMENT = "comments/addComments"

export const createComment = (newComment) =>({
    type: ADD_COMMENT,
    newComment
})

export const addCommentThunk = (newComment, postId)=>async dispatch =>{

    console.log("*****",postId)

    const response = await fetch (`/api/posts/${postId}/comments`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    });
    if (response.ok){
        const createdComment = await response.json()
        // dispatch(getAllPosts)

    }else{
        console.log("add comment failed in store")
    }
}

//edit comment

//delete comment

//reducer
const initialState = {}

export default function commentsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            const newAllComments = {}
            action.allComments.forEach(comment => {
                // console.log("comment reducer", comment)
                return newAllComments[comment.comment_id] = comment
            })

            return {
                ...state,
                allComments: {
                    ...newAllComments
                }
            }
        case ADD_COMMENT:{
            const addCommentState ={...state}
            console.log("!!!!",addCommentState)
            addCommentState.allComments[action.newComment.comment_id]=action.comment
            return addCommentState
        }

        default:
            return state;
    }
}