import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import PostList from "./components/PostList"
import MessagingPage from "./components/MessagingPage"
import Splash from "./components/Splash";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import ConnectionComponent from "./components/Connection";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <>
          <Switch>
            <Route path="/login" >
              <LoginFormPage />
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
            <Route exact path="/home">
              <PostList />
            </Route>
            <Route exact path="/messaging">
              <MessagingPage />
            </Route>
            <Route exact path="/messaging/:conversationId">
              <MessagingPage />
            </Route>
            <Route exact path="/">
              <Splash />
            </Route>
            <Route exact path="/mynetwork">
              <ConnectionComponent />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
