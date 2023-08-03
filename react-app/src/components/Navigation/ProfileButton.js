import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { login } from "../../store/session";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./ProfileButoon.css";

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
    history.push("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <li>
      {user ? (
        <button onClick={handleLogout} className="join-in-button">
          <span className="sign-out-text">Sign Out</span>
        </button>
      ) : (
        <div className="three-top-buttons">
          <OpenModalButton
            className="join-in-button"
            buttonText="Join Now"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />

          <OpenModalButton
            className="sign-in-button-top"
            buttonText="Sign In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />

          <button
            className="sign-in-button-top"
            onClick={() => {
              dispatch(login("demo@aa.io", "password"));
              closeModal();
            }}
          >
            Demo User
          </button>
        </div>
      )}
    </li>
  );
}

export default ProfileButton;
