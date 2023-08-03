//load all likes

const LOAD = "likes/loadLikes";
export const loadLike = (likesObj) => ({
  type: LOAD,
  allLikes: likesObj,
});

export const getAllLikes = () => async (dispatch) => {
  const response = await fetch("/api/posts/likes");
  if (response.ok) {
    const likesObj = await response.json();

    dispatch(loadLike(likesObj));
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

//create like

const ADD_LIKE = "likes/addLikes";

export const createLike = (newLike) => ({
  type: ADD_LIKE,
  newLike,
});

export const addLikeThunk =
  ({ user_id, post_id }) =>
  async (dispatch) => {
    const response = await fetch("/api/posts/createLike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, post_id }),
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

export const deleteLikeThunk =
  ({ user_id, post_id }) =>
  async (dispatch) => {
    const res = await fetch(`/api/posts/deleteLike`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, post_id }),
    });
    if (res.ok) {
      dispatch(getAllLikes());
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

const initialState = { allLikes: {} };

export default function likeReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      const newAllLikes = action.allLikes;

      return {
        ...state,
        allLikes: {
          ...newAllLikes,
        },
      };

    default:
      return state;
  }
}
