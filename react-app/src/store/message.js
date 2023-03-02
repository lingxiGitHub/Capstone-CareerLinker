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



//create


//update

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

        default:
            return state;
    }
}