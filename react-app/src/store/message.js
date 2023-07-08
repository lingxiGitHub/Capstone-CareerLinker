//load all message

const LOAD = "message/loadMessage";
export const loadMessage = (list) => ({
  type: LOAD,
  allMessages: list,
});

export const getAllMessages = () => async (dispatch) => {
  const response = await fetch("/api/messages");
  if (response.ok) {
    const list = await response.json();

    dispatch(loadMessage(list));
  }
};

//load single message by conversation id

const LOADSINGLEMESSAGE = "message/loadSingleMessage";
export const loadSingleMessage = (detailedMessage) => ({
  type: LOADSINGLEMESSAGE,
  singleMessage: detailedMessage,
});

export const getSingleMessage = (conversationId) => async (dispatch) => {
  const response = await fetch(`/api/conversations/${conversationId}/messages`);
  if (response.ok) {
    const detailedMessage = await response.json();

    dispatch(loadSingleMessage(detailedMessage));
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};
//create message

const ADD_MESSAGE = "messages/addMessages";

export const createMessage = (newMessage) => ({
  type: ADD_MESSAGE,
  newMessage,
});

export const addMessageThunk = (newMessage) => async (dispatch) => {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMessage),
  });
  if (response.ok) {
    const createdMessage = await response.json();
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

//edit
const UPDATE_MESSAGE = "messages/updateMessage";

export const updateMessage = (message) => ({
  type: UPDATE_MESSAGE,
  message,
});

export const updateMessageThunk =
  (message, conversationId) => async (dispatch) => {
    const { messageId, user_id, message_content, conversation_id } = message;

    const res = await fetch(`/api/messages/${+messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageId,
        user_id,
        message_content,
        conversation_id: conversationId,
      }),
    });

    if (res.ok) {
      const updatedMessage = await res.json();

      dispatch(updateMessage(updatedMessage));
      return updatedMessage;
    } else if (res.status < 500) {
      const data = await res.json();
      if (data.errors) {
        return data.errors;
      }
    } else {
      return ["An error occurred. Please try again."];
    }
  };

//delete
const DELETE_MESSAGE = "messages/deleteMessage";
export const deleteMessage = (messageId) => ({
  type: DELETE_MESSAGE,
  messageId,
});

export const deleteMessageThunk =
  (messageId, conversationId) => async (dispatch) => {
    const res = await fetch(`/api/messages/${messageId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      dispatch(deleteMessage(messageId));
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

export default function messageReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      const newAllMessages = {};
      action.allMessages.forEach((message) => {
        return (newAllMessages[message.message_id] = message);
      });

      return {
        ...state,
        allMessages: {
          ...newAllMessages,
        },
      };
    case LOADSINGLEMESSAGE:
      const newSingleMessage = {};
      action.singleMessage.forEach((message) => {
        return (newSingleMessage[message.message_id] = message);
      });

      return {
        ...state,
        singleMessage: {
          ...newSingleMessage,
        },
      };

    case ADD_MESSAGE: {
      const addMessageState = { ...state };

      addMessageState.singleMessage[action.message.id] = action.message;

      return addMessageState;
    }

    case UPDATE_MESSAGE: {
      const updateMessageState = { ...state };

      updateMessageState.singleMessage[action.message.id] = action.message;

      return updateMessageState;
    }

    case DELETE_MESSAGE: {
      const deleteMessageState = { ...state };

      return deleteMessageState;
    }
    default:
      return state;
  }
}
