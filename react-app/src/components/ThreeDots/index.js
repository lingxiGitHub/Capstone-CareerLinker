import "./ThreeDots.css"
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import EditPostModal from "../EditPostModal";
import DeletePost from "../DeletePostModal";

export default function ThreeDots({ post }) {


    const threeDotSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
            <path d="M14 12a2 2 0 11-2-2 2 2 0 012 2zM4 10a2 2 0 102 2 2 2 0 00-2-2zm16 0a2 2 0 102 2 2 2 0 00-2-2z"></path>
        </svg>
    )
    const sessionUser = useSelector(state => state.session.user)
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

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

 

    const ulClassName = "three-dots-dropdown" + (showMenu ? "" : " hidden");
    const closeMenu = () => setShowMenu(false);


    return (

        <div className="three-dots-drop-down">
            <button
                className="three-dots"
                onClick={openMenu}
            >{threeDotSvg}</button>

            <ul className={ulClassName} ref={ulRef}>

                <li className="three-dots-li">
                    <OpenModalButton
                        buttonText="Edit"
                        className="edit-delete-post-button"
                        modalComponent={<EditPostModal post={post} />}
                    />
                </li>

                <li className="three-dots-li">
                    <OpenModalButton
                        buttonText="Delete"
                        className="edit-delete-post-button"
                        modalComponent={<DeletePost post={post} />}
                    />
                </li>

            </ul>

        </div>
    )
}