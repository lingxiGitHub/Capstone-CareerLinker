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

    // console.log("*****",postId)

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
const UPDATE_COMMENT = "commentss/updateComment"

export const updateComment = (comment) => ({
    type: UPDATE_COMMENT,
    comment
})

export const updateCommentThunk = (comment, postId, commentId) => async dispatch => {
    // console.log("post at update post thunk", post)
    const {
        id,
        user_id,
        post_id,
        comment_content,

    } = comment

    const res = await fetch(`/api/posts/${+postId}/comments/${+commentId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            user_id,
            post_id,
            comment_content,
            
        })
    })

    if (res.ok) {
        // console.log("edit post thunk res is ok", res)
        const updatedComment = await res.json()
        // console.log("%%%%%%%%updatedPost", updatedPost)
        dispatch(updateComment(updatedComment))
        dispatch(getAllPosts())
        dispatch(getAllComments())
        return updatedComment
    } else {
        console.log("edit comment thunk failed")
    }


}

//delete comment
const DELETE_COMMENT = "posts/deleteComment"
export const deleteComment = (postId, commentId) => ({
    type: DELETE_COMMENT,
    postId,
    commentId
})

export const deleteCommentThunk = (postId, commentId) => async dispatch => {

    const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteComment(postId,commentId))
        dispatch(getAllPosts())
        dispatch(getAllComments())
    }

}

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
            // console.log("!!!!",addCommentState)
            addCommentState.allComments[action.newComment.comment_id]=action.newComment
            return addCommentState
        }

        case UPDATE_COMMENT: {
            const updateCommentState = { ...state }
            console.log("look at update reducer", updateCommentState)
            updateCommentState.allComments[action.comment.comment_id] = action.comment
            // console.log("look")
            // console.log("updateSpotState",updateSpotState)
            return updateCommentState
        }

        default:
            return state;
    }
}