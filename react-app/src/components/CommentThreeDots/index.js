import "./CommentThreeDots.css";
import React from "react";
import OpenModalButton from "../OpenModalButton";
import EditComment from "../EditComment";
import DeleteCommentComponent from "../DeleteComment";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function CommentThreeDots({ post, comment }) {
  const commentThreeDotSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      data-supported-dps="16x16"
      fill="currentColor"
      width="16"
      height="16"
      focusable="false"
    >
      <path d="M3 9.5A1.5 1.5 0 114.5 8 1.5 1.5 0 013 9.5zM11.5 8A1.5 1.5 0 1013 6.5 1.5 1.5 0 0011.5 8zm-5 0A1.5 1.5 0 108 6.5 1.5 1.5 0 006.5 8z"></path>
    </svg>
  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="three-dots-drop-down">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {commentThreeDotSvg}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <OpenModalButton
            buttonText="Edit"
            className="edit-delete-button"
            modalComponent={<EditComment post={post} comment={comment} />}
          />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <OpenModalButton
            buttonText="Delete"
            className="edit-delete-button"
            modalComponent={
              <DeleteCommentComponent post={post} comment={comment} />
            }
          />
        </MenuItem>
      </Menu>
    </div>
  );
}
