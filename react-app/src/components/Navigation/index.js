import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from "./linkedin-logo.png"




function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);
	// const logo = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" className='logo' width="24" height="24" focusable="false">
	// 	<path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
	// </svg>)

	const inLogo = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="rgb(10,102,194)" class="mercado-match" width="41" height="41" focusable="false">
		<path d="M 20.5 2 L 3.5 2 C 2.672 2 2 2.672 2 3.5 L 2 20.5 C 2 21.328 2.672 22 3.5 22 L 20.5 22 C 21.328 22 22 21.328 22 20.5 L 22 3.5 C 22 2.672 21.328 2 20.5 2 Z M 8 19 L 5 19 L 5.08 4.775 L 8.059 4.768 L 8 19 Z M 19 19 L 16 19 L 16 14.26 C 16 12.84 15.4 12.33 14.62 12.33 C 13.658 12.394 12.931 13.228 13 14.19 C 12.995 14.237 12.995 14.283 13 14.33 L 13 19 L 10 19 L 10 10 L 12.9 10 L 12.9 11.3 C 13.495 10.395 14.518 9.865 15.6 9.9 C 17.15 9.9 18.96 10.76 18.96 13.56 L 19 19 Z"></path>
	</svg>)

	const homeSVG = (<svg xmlns="http://www.w3.org/2000/svg" className='header-font' viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
		<path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
	</svg>)

	const messageSVG = (<svg xmlns="http://www.w3.org/2000/svg" className='header-font' viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
		<path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
	</svg>)

	const networkSVG = (<svg xmlns="http://www.w3.org/2000/svg" className='header-font' viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
		<path d="M12 6.5a4.5 4.5 0 114.5 4.5A4.49 4.49 0 0112 6.5zm6 6.5h-3a3 3 0 00-3 3v6h9v-6a3 3 0 00-3-3zM6.5 6A3.5 3.5 0 1010 9.5 3.5 3.5 0 006.5 6zm1 9h-2A2.5 2.5 0 003 17.5V22h7v-4.5A2.5 2.5 0 007.5 15z"></path>
	</svg>)

	return (
		<ul className='header'>
			<li>
				<NavLink className="nav-link" exact to="/"> {inLogo}</NavLink>
			
			</li>


			{sessionUser && (
				<>
					<li>
						<NavLink className="nav-link" exact to="/home">
							{homeSVG}
							<div className='header-font'>Home</div>

						</NavLink>
					</li>


					<li>
						<NavLink className="nav-link" exact to="/messaging">
							{messageSVG}
							<div className='header-font'>Messaging</div>
						</NavLink>
					</li>
					<li>
						<NavLink className="nav-link" exact to="/mynetwork">
							{networkSVG}
							<div className='header-font'>My NetWork</div>
						</NavLink>
					</li>
				</>

			)}

			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</ul>
	);
}

export default Navigation;