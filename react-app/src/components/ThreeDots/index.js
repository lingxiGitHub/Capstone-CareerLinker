import "./ThreeDots.css";
import React from "react";
import OpenModalButton from "../OpenModalButton";
import EditPostModal from "../EditPostModal";
import DeletePost from "../DeletePostModal";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function ThreeDots({ post }) {
  const threeDotSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      data-supported-dps="24x24"
      fill="currentColor"
      width="24"
      height="24"
      focusable="false"
    >
      <path d="M14 12a2 2 0 11-2-2 2 2 0 012 2zM4 10a2 2 0 102 2 2 2 0 00-2-2zm16 0a2 2 0 102 2 2 2 0 00-2-2z"></path>
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
    <>
      <div className="three-dots-drop-down">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          {threeDotSvg}
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
              modalComponent={<EditPostModal post={post} />}
            />
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <OpenModalButton
              buttonText="Delete"
              className="edit-delete-button"
              modalComponent={<DeletePost post={post} />}
            />
          </MenuItem>

     
        </Menu>
      </div>
    </>
  );
}
