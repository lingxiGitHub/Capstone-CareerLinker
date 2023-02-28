import "./CommentThreeDots.css"
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import EditComment from "../EditComment"
import DeleteCommentComponent from "../DeleteComment"

export default function CommentThreeDots({post , comment}){


    const commentThreeDotSvg = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
        <path d="M3 9.5A1.5 1.5 0 114.5 8 1.5 1.5 0 013 9.5zM11.5 8A1.5 1.5 0 1013 6.5 1.5 1.5 0 0011.5 8zm-5 0A1.5 1.5 0 108 6.5 1.5 1.5 0 006.5 8z"></path>
    </svg>)
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
                className="three-dots-comment"
                onClick={openMenu}
            >{commentThreeDotSvg}</button>

            <ul className={ulClassName} ref={ulRef}>

                <li className="three-dots-li">
                    <OpenModalButton
                        buttonText="Edit"
                        className="edit-delete-post-button"
                        modalComponent={<EditComment post={post} comment={comment} />}
                    />
                </li>

                <li className="three-dots-li">
                    <OpenModalButton
                        buttonText="Delete"
                        className="edit-delete-post-button"
                        modalComponent={<DeleteCommentComponent post={post} comment={comment} />}
                    />
                </li>

            </ul>

        </div>

    )


}
