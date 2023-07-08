import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };

  return (
    <div className="log-in-modal">
      <h1 className="log-in-word">Sign In</h1>
      <p className="log-in-p">Stay updated on your professional world</p>
      <form onSubmit={handleSubmit} className="log-on-form">
        <ul>
          {errors.map((error, idx) => (
            <li class="error-red" key={idx}>
              {error}
            </li>
          ))}
        </ul>
        <label>
          <input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="log-in-button">
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
