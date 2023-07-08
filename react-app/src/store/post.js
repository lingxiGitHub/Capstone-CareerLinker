//load all posts
const LOAD = "posts/loadPosts";
export const loadPost = (list) => ({
  type: LOAD,
  allPosts: list,
});

export const getAllPosts = () => async (dispatch) => {
  const response = await fetch("/api/posts");
  if (response.ok) {
    const listObj = await response.json();
    const list = listObj.posts;
    dispatch(loadPost(list));
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

// create a post
const ADD_POST = "posts/addPosts";

export const createPost = (newPost) => ({
  type: ADD_POST,
  newPost,
});

export const addPostThunk = (newPost) => async (dispatch) => {
  const response = await fetch("/api/posts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  if (response.ok) {
    const createdPost = await response.json();
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

//edit a post
const UPDATE_POST = "posts/updatePost";

export const updatePost = (post) => ({
  type: UPDATE_POST,
  post,
});

export const updatePostThunk = (post) => async (dispatch) => {
  const { id, user_id, post_content, post_photo } = post;

  const res = await fetch(`/api/posts/${+id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      user_id,
      post_content,
      post_photo,
    }),
  });

  if (res.ok) {
    const updatedPost = await res.json();

    dispatch(updatePost(updatedPost));
    dispatch(getAllPosts());
    return updatedPost;
  } else if (res.status < 500) {
    const data = await res.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

//delete a post
const DELETE_POST = "posts/deletePost";
export const deletePost = (id) => ({
  type: DELETE_POST,
  id,
});

export const deletePostThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    dispatch(deletePost(id));
    dispatch(getAllPosts());
  }
};

//reducer
const initialState = {};

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      const newAllPosts = {};
      action.allPosts.forEach((post) => {
        return (newAllPosts[post.post_id] = post);
      });

      return {
        ...state,
        allPosts: {
          ...newAllPosts,
        },
      };

    case ADD_POST: {
      const addPostState = { ...state };

      addPostState.allPosts[action.post.id] = action.post;

      return addPostState;
    }

    case UPDATE_POST: {
      const updatePostState = { ...state };

      updatePostState.allPosts[action.post.id] = action.post;

      return updatePostState;
    }

    case DELETE_POST: {
      const deletePostState = { ...state };

      return deletePostState;
    }

    default:
      return state;
  }
}
