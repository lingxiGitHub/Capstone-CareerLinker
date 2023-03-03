import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from "./linkedin-logo.png"




function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul className='header'>
			<li>
				<NavLink exact to="/"><img className="logo" src={logo} alt=""></img></NavLink>
			</li>

			<li>
				<NavLink exact to="/home">Home</NavLink>
			</li>
			<li>
				<NavLink exact to="/messaging"> Messaging</NavLink>
			</li>
			<li>
				<NavLink exact to="/jobs"> Jobs</NavLink>
			</li>
			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</ul>
	);
}

export default Navigation;