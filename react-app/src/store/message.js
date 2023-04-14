//load all message

const LOAD = "message/loadMessage"
export const loadMessage = (list) => ({
    type: LOAD,
    allMessages: list
})

export const getAllMessages = () => async dispatch => {
    const response = await fetch("/api/messages")
    if (response.ok) {
        const list = await response.json()
        // console.log("message list", list)
        dispatch(loadMessage(list))
    } else {
        // console.log("get all message fetch failed")
    }
}

//load single message by conversation id

const LOADSINGLEMESSAGE = "message/loadSingleMessage"
export const loadSingleMessage = (detailedMessage) => ({
    type: LOADSINGLEMESSAGE,
    singleMessage: detailedMessage
})

export const getSingleMessage = (conversationId) => async dispatch => {

    const response = await fetch(`/api/conversations/${conversationId}/messages`)
    if (response.ok) {
        const detailedMessage = await response.json()
        // console.log("single message", detailedMessage)
        dispatch(loadSingleMessage(detailedMessage))
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
//create message

const ADD_MESSAGE = "messages/addMessages"

export const createMessage = (newMessage) => ({
    type: ADD_MESSAGE,
    newMessage
})

export const addMessageThunk = (newMessage) => async dispatch => {
    // let createdRestaurantId;
    // console.log("I am in addRestaurantThunk")
    const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
    });
    if (response.ok) {
        const createdMessage = await response.json()

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

//edit
const UPDATE_MESSAGE = "messages/updateMessage"

export const updateMessage = (message) => ({
    type: UPDATE_MESSAGE,
    message
})

export const updateMessageThunk = (message, conversationId) => async dispatch => {
    // console.log("post at update post thunk", post)
    const {
        messageId,
        user_id,
        message_content,
        conversation_id
    } = message

    const res = await fetch(`/api/messages/${+messageId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messageId,
            user_id,
            message_content,
            conversation_id:conversationId,
        })
    })

    if (res.ok) {
        // console.log("edit post thunk res is ok", res)
        const updatedMessage = await res.json()
        // console.log("%%%%%%%%updatedPost", updatedPost)
        dispatch(updateMessage(updatedMessage))
        return updatedMessage
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            // console.log("%%%%", data.errors)
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }

    // const response = await fetch(`/api/conversations/${conversationId}/messages`)
    // if (response.ok) {
    //     const detailedMessage = await response.json()
    //     // console.log("single message", detailedMessage)
    //     dispatch(loadSingleMessage(detailedMessage))
    // }
}


//delete
const DELETE_MESSAGE = "messages/deleteMessage"
export const deleteMessage = (messageId) => ({
    type: DELETE_MESSAGE,
    messageId
})

export const deleteMessageThunk = (messageId,conversationId) => async dispatch => {

    const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteMessage(messageId))
        // dispatch(loadSingleMessage(detailedMessage))
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            // console.log("%%%%", data.errors)
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }

    // const response = await fetch(`/api/conversations/${conversationId}/messages`)
    // if (response.ok) {
    //     const detailedMessage = await response.json()
    //     // console.log("single message", detailedMessage)
    //     await dispatch(loadSingleMessage(detailedMessage))
    // }


}


//reducer

const initialState = {}

export default function messageReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            const newAllMessages = {}
            action.allMessages.forEach(message => {
                // console.log("message at store", message)

                return newAllMessages[message.message_id] = message

            });

            return {
                ...state,
                allMessages: {
                    ...newAllMessages
                }
            }
        case LOADSINGLEMESSAGE:
            const newSingleMessage = {}
            action.singleMessage.forEach(message => {
                // console.log("single message at store", message)

                return newSingleMessage[message.message_id] = message
            })

            return {
                ...state,
                singleMessage: {
                    ...newSingleMessage
                }
            }

        case ADD_MESSAGE: {
            const addMessageState = { ...state }
            // console.log("look at update reducer", addPostState)
            addMessageState.singleMessage[action.message.id] = action.message
            // console.log("look")
            // console.log("updateSpotState",updateSpotState)
            return addMessageState
        }

        case UPDATE_MESSAGE: {
            const updateMessageState = { ...state }
            // console.log("look at update reducer", updatePostState)
            updateMessageState.singleMessage[action.message.id] = action.message
            // console.log("look")
            // console.log("updateSpotState",updateSpotState)
            return updateMessageState
        }

        case DELETE_MESSAGE: {
            const deleteMessageState = { ...state }
            // console.log(deletePostState)
            // delete deletePostState.allPosts[action.post.id]
            return deleteMessageState
        }
        default:
            return state;
    }
}