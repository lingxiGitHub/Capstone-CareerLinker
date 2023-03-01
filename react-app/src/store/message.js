//load all message

const LOAD = "message/loadMessage"
export const loadMessage = (list) => ({
    type: LOAD,
    allMessages: list
})

export const getAllMessages = () => async dispatch => {
    const response = await fetch("/api/conversations")
    if (response.ok) {
        const list = await response.json()
        console.log(list)
        dispatch(loadConversation(list))
    } else {
        console.log("get all conversation fetch failed")
    }
}


//create


//update

//delete

//reducer

const initialState = {}

export default function conversationReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            const newAllConversations = {}
            action.allConversations.forEach(conversation => {
                // console.log("message at store",message)

                return newAllConversations[conversation.conversation_id] = conversation

            });

            return {
                ...state,
                allConversations: {
                    ...newAllConversations
                }
            }

        default:
            return state;
    }
}