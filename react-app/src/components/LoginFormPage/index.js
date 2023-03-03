import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useHistory, } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import './LoginForm.css';

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
    history.push("/home")
    if (data) {
      setErrors(data);
    }
  };

  return (
    <>

      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="splash-log-in">
          <label className="splash-label">
            Email
            <input className="log-in-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="splash-label">
            Password
            <input className="log-in-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="sign-in-button" type="submit">Sign In</button>
          <button
            className="demo-button"
            onClick={() => {
              dispatch(login("demo@aa.io", "password"));
              closeModal();
            }
            }
          >Demo User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormPage;
