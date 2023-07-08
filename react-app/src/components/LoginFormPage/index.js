import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));

    if (data) {
      setErrors(data);
    } else {
      history.push("/home");
    }
  };

  return (
    <div className="splash-left-flex">
      <form onSubmit={handleSubmit} className="splash-left">
        <ul>
          {errors.map((error, idx) => (
            <li class="error-red" key={idx}>
              {error}
            </li>
          ))}
        </ul>
        <div className="splash-log-in">
          <label className="splash-label">
            Email
            <input
              className="log-in-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="splash-label">
            Password
            <input
              className="log-in-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="sign-in-button" type="submit">
            Sign In
          </button>
        </div>
      </form>

      <button
        className="demo-button"
        onClick={async () => {
          await dispatch(login("demo@aa.io", "password"));
          await closeModal();
          history.push("/home");
        }}
      >
        Demo User
      </button>

      <div class="lines">
        <div class="line-1"></div>
        <p className="or">or</p>
        <div class="line-2"></div>
      </div>

      <OpenModalButton
        buttonText="New to Linkedin? Join now"
        className="splash-sign-up"
        modalComponent={<SignupFormModal />}
      />
    </div>
  );
}

export default LoginFormPage;
