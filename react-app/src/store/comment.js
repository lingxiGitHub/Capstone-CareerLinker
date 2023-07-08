import { getAllPosts } from "./post";

//load all comments
const LOAD = "comments/loadComments";
export const loadComment = (list) => ({
  type: LOAD,
  allComments: list,
});

export const getAllComments = () => async (dispatch) => {
  const response = await fetch("/api/comments");
  if (response.ok) {
    const listObj = await response.json();
    const list = listObj.comments;
    dispatch(loadComment(list));
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

//create comment
const ADD_COMMENT = "comments/addComments";

export const createComment = (newComment) => ({
  type: ADD_COMMENT,
  newComment,
});

export const addCommentThunk = (newComment, postId) => async (dispatch) => {
  const response = await fetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newComment),
  });
  if (response.ok) {
    const createdComment = await response.json();
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

//edit comment
const UPDATE_COMMENT = "commentss/updateComment";

export const updateComment = (comment) => ({
  type: UPDATE_COMMENT,
  comment,
});

export const updateCommentThunk =
  (comment, postId, commentId) => async (dispatch) => {
    const { id, user_id, post_id, comment_content } = comment;

    const response = await fetch(
      `/api/posts/${+postId}/comments/${+commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          user_id,
          post_id,
          comment_content,
        }),
      }
    );

    if (response.ok) {
      const updatedComment = await response.json();

      dispatch(updateComment(updatedComment));
      dispatch(getAllPosts());
      dispatch(getAllComments());
      return updatedComment;
    } else if (response.status < 500) {
      const data = await response.json();
      if (data.errors) {
        return data.errors;
      }
    } else {
      return ["An error occurred. Please try again."];
    }
  };

//delete comment
const DELETE_COMMENT = "posts/deleteComment";
export const deleteComment = (postId, commentId) => ({
  type: DELETE_COMMENT,
  postId,
  commentId,
});

export const deleteCommentThunk = (postId, commentId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });
  if (res.ok) {
    dispatch(deleteComment(postId, commentId));
    dispatch(getAllPosts());
    dispatch(getAllComments());
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

export default function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      const newAllComments = {};
      action.allComments.forEach((comment) => {
        return (newAllComments[comment.comment_id] = comment);
      });

      return {
        ...state,
        allComments: {
          ...newAllComments,
        },
      };
    case ADD_COMMENT: {
      const addCommentState = { ...state };

      addCommentState.allComments[action.newComment.comment_id] =
        action.newComment;
      return addCommentState;
    }

    case UPDATE_COMMENT: {
      const updateCommentState = { ...state };

      updateCommentState.allComments[action.comment.comment_id] =
        action.comment;

      return updateCommentState;
    }

    default:
      return state;
  }
}
