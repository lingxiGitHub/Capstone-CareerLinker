import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";
import TextField from "@mui/material/TextField";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [profile_photo, setProfile_photo] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const regex = new RegExp(".+@.+\\..+");
    const isvalidEmail = regex.test(email);

    if (!isvalidEmail) {
      setErrors(["Not a valid email"]);
      return;
    }

    if (password === confirmPassword) {
      const data = await dispatch(
        signUp({
          username,
          email,
          password,
          first_name,
          last_name,
          profile_photo,
        })
      );
      if (data) {
        setErrors(data);
      } else {
        closeModal();
      }
    } else {
      setErrors([
        "Confirm Password field must be the same as the Password field",
      ]);
    }
  };

  return (
    <>
      <h1 className="sign-up-word">Make the most of your professional life</h1>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li class="error-red" key={idx}>
              {error}
            </li>
          ))}
        </ul>

        <TextField
          required
          className="sign-up-input"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          required
          className="sign-up-input"
          label="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          required
          className="sign-up-input"
          label="First Name"
          value={first_name}
          onChange={(e) => setFirst_name(e.target.value)}
        />

        <TextField
          required
          className="sign-up-input"
          label="Last Name"
          value={last_name}
          onChange={(e) => setLast_name(e.target.value)}
        />

        <TextField
          required
          className="sign-up-input"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          required
          className="sign-up-input"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="sign-up-submit-button" type="submit">
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
