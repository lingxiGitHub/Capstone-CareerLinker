//load all connections

const LOAD = "connections/loadConnections";
export const loadConnection = (connectionObj) => ({
  type: LOAD,
  allConnections: connectionObj,
});

export const getAllConnections = () => async (dispatch) => {
  const response = await fetch("/api/users/connections");
  if (response.ok) {
    const connectionObj = await response.json();

    dispatch(loadConnection(connectionObj));
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

//add a connection
const ADD_CONNECTION = "connections/addConnections";

export const createConnection = (newConnection) => ({
  type: ADD_CONNECTION,
  newConnection,
});

export const addConnectionThunk = (connected_user_id) => async (dispatch) => {
  const response = await fetch("/api/users/add-connection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ connected_user_id }),
  });
  if (response.ok) {
    dispatch(getAllConnections());
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

//delete a connection
const DELETE_CONNECTION = "connections/deleteConnection";
export const deleteConnection = (connected_user_id) => ({
  type: DELETE_CONNECTION,
  connected_user_id,
});

export const deleteConnectionThunk =
  (connected_user_id) => async (dispatch) => {
    const res = await fetch(`/api/users/delete-connection`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connected_user_id: connected_user_id }),
    });
    if (res.ok) {
      dispatch(getAllConnections());
    } else if (res.status < 500) {
      const data = await res.json();
      if (data.errors) {
        return data.errors;
      }
    } else {
      return ["An error occurred. Please try again."];
    }
  };

//reducer

const initialState = {};

export default function connectionReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      const newAllConnections = action.allConnections;
      return {
        ...state,
        allConnections: {
          ...newAllConnections,
        },
      };
    default:
      return state;
  }
}
