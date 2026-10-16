import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Button.css";

/**
 * Pill buttons. variant: primary | secondary | tertiary | muted ; size: sm | md | lg
 * Pass `to` for a router link, `icon` for a leading icon.
 */
export default function Button({ variant = "secondary", size = "md", icon, to, className = "", children, ...rest }) {
  const cls = `btn btn-${variant} btn-${size} ${children ? "" : "btn-icon-only"} ${className}`;
  const body = (
    <>
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 20} />}
      {children}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {body}
    </button>
  );
}

export function IconButton({ icon, label, size = 24, className = "", ...rest }) {
  return (
    <button type="button" className={`icon-btn ${className}`} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={size} />
    </button>
  );
}
