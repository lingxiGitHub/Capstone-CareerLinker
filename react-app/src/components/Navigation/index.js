import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';




function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul className='header'>
			<img></img>
			<li>
				<NavLink exact to="/">Home</NavLink>
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