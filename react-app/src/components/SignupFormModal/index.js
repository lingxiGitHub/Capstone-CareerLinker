import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [first_name, setFirst_name] = useState("")
	const [last_name, setLast_name] = useState("")
	const [profile_photo, setProfile_photo] = useState("")
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const regex = new RegExp(".+@.+\\..+")
		const isvalidEmail = regex.test(email)

		if (!isvalidEmail) {

			setErrors([
				"Not a valid email",
			]);
			return
		}

		// if (password.length>4 || password.length>20){
		// 	setErrors([
		// 		"password must be between 4 and 20 characters",
		// 	]);
		// 	return
		// }

		if (password === confirmPassword) {
			const data = await dispatch(signUp({username, email, password, first_name, last_name, profile_photo}));
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
			<h1 className="sign-up-word">Sign Up</h1>
			<form 
			className="sign-up-form"
			onSubmit={handleSubmit}
			>
				<ul>
					{errors.map((error, idx) => (
						<li class="error-red" key={idx}>{error}</li>
					))}
				</ul>
				<label><span>
					Email</span>
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label><span>
					Username</span>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<label><span>
					First Name</span>
					<input
						type="text"
						value={first_name}
						onChange={(e) => setFirst_name(e.target.value)}
						required
					/>
				</label>
				<label><span>
					Last Name</span>
					<input
						type="text"
						value={last_name}
						onChange={(e) => setLast_name(e.target.value)}
						required
					/>
				</label>
				{/* <label><span>
					Profile Photo (optional)</span>
					<input
						type="text"
						value={profile_photo}
						placeholder="https://"
						onChange={(e) => setProfile_photo(e.target.value)}
					/>
				</label> */}
				<label><span>
					Password</span>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<label><span>
					Confirm Password</span>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				<button className="sign-up-submit-button" type="submit">Sign Up</button>
			</form>
		</>
	);
}

export default SignupFormModal;