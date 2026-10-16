import { useState } from "react";
import "./Avatar.css";

const PALETTE = ["#0a66c2", "#057642", "#915907", "#8344cc", "#b24020", "#0f7b8a", "#c4316a"];

export function initials(user) {
  return `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase() || "?";
}

/** Profile photo with a colored-initials fallback when there's no photo or it fails to load. */
export default function Avatar({ user, size = 48, className = "", ring = false }) {
  const [failed, setFailed] = useState(false);
  const src = user?.profile_photo;
  const style = { width: size, height: size, fontSize: Math.max(10, size * 0.38) };
  const cls = `avatar ${ring ? "avatar-ring" : ""} ${className}`;

  if (src && !failed) {
    return (
      <img
        className={cls}
        style={style}
        src={src}
        alt={user ? `${user.first_name} ${user.last_name}` : ""}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    );
  }
  const color = PALETTE[(user?.id ?? 0) % PALETTE.length];
  return (
    <span className={cls} style={{ ...style, background: color }} aria-label={user ? `${user.first_name} ${user.last_name}` : ""}>
      {initials(user)}
    </span>
  );
}

/** Square logo tile for companies and schools (we don't have real logos). */
export function OrgLogo({ name = "", size = 48, kind = "company" }) {
  const hash = [...name].reduce((n, c) => n + c.charCodeAt(0), 0);
  const color = PALETTE[hash % PALETTE.length];
  return (
    <span
      className="org-logo"
      style={{ width: size, height: size, fontSize: size * 0.42, background: kind === "school" ? "#f3f6f8" : `${color}14`, color }}
      aria-hidden="true"
    >
      {name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}
