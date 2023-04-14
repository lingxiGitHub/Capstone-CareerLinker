import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { login } from "../../store/session";
import { useModal } from "../../context/Modal";
import { useHistory, } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const { closeModal } = useModal();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push("/")
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button
        className="profile-button"
        onClick={openMenu}
      >
        {user ? (
          <img className="login-photo" src={user.profile_photo} alt=""></img>
         
        ):(
        <i className="fas fa-user-circle" />

        )}
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div>
            <li className="top-drop">{user.username}</li>
            <li className="mid-drop">{user.email}</li>
            <li className="bottom-drop">
              <button onClick={handleLogout}><span className="sign-out-text">Sign Out</span></button>
            </li>
          </div>
        ) : (
          <div>
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />


            <button
              className="demo-button-drop-down"
              onClick={() => {
                dispatch(login("demo@aa.io", "password"));
                closeModal();
              }
              }
            >Demo User</button>
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
