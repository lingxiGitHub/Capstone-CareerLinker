

//load all conversations

const LOAD = "conversations/loadConversations"
export const loadConversation = (list) => ({
    type: LOAD,
    allConversations: list
})

export const getAllConversations = () => async dispatch => {
    const response = await fetch("/api/conversations")
    if (response.ok) {
        const list = await response.json()
        // console.log(list)
        dispatch(loadConversation(list))
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


//load current user's conversations
const LOADCURRENT = "conversations/loadCurrentUserConversation"
export const loadCurrentUserConversation = (list) => ({
    type: LOADCURRENT,
    currentConversations: list
})

export const getCurrentUserConversations = () => async dispatch => {
    const response = await fetch("/api/conversations/current")
    if (response.ok) {
        // console.log("i am fetching current ")
        const list = await response.json()
        dispatch(loadCurrentUserConversation(list))
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

        case LOADCURRENT:
            const newCurrentConversations = {}
            action.currentConversations.forEach(conversation => {
                if (conversation.other == true) {

                    // console.log("hey this is current user's conv", conversation)
                    return newCurrentConversations[conversation.conversation_id] = conversation
                }


            })

            return {
                ...state,
                currentConversations: {
                    ...newCurrentConversations
                }
            }

        default:
            return state;
    }
}