import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session";
import postsReducer from "./post";
import commentsReducer from "./comment";
import conversationReducer from "./conversation";
import messageReducer from "./message";
import likeReducer from "./like";
import connectionReducer from "./connection";

const rootReducer = combineReducers({
  session,
  posts: postsReducer,
  comments: commentsReducer,
  conversations: conversationReducer,
  messages: messageReducer,
  likes: likeReducer,
  connections: connectionReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
