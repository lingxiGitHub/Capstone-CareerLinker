//load all connections



const LOAD = "connections/loadConnections"
export const loadConnection=(connectionObj)=>({
    type:LOAD,
    allConnections:connectionObj
})

export const getAllConnections = () => async dispatch =>{
    const response = await fetch("/api/users/connections")
    if (response.ok){
        // console.log("I got connections in the thunk")
        const connectionObj = await response.json()
        // console.log("look at connection obj",connectionObj)
        dispatch(loadConnection(connectionObj))
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

//add a connection

//delete a connection

//reducer

const initialState ={}

export default function connectionReducer(state = initialState, action){
    switch(action.type){
        case LOAD:
            const newAllConnections = action.allConnections
            return {
                ...state,
                allConnections:{
                    ...newAllConnections
                }
            }
        default:
            return state;
    }
}