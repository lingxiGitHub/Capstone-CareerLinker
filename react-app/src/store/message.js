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
        console.log("get all message fetch failed")
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
    } else {
        console.log("get single message fetch failed")
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
            console.log("%%%%", data.errors)
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
}

//edit

//delete



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
            addMessageState.allMessages[action.message.id] = action.message
            // console.log("look")
            // console.log("updateSpotState",updateSpotState)
            return addMessageState
        }

        default:
            return state;
    }
}