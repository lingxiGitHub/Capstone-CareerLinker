import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import "./Menu.css";

/** A dropdown anchored to its trigger. `items` = [{ icon, label, onClick, danger }] */
export default function Menu({ trigger, items, align = "right", label = "More actions" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="menu" ref={ref}>
      <button type="button" className="menu-trigger" aria-haspopup="menu" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)}>
        {trigger ?? <Icon name="more" />}
      </button>
      {open && (
        <ul className={`menu-list menu-${align}`} role="menu">
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                className={`menu-item ${item.danger ? "menu-danger" : ""}`}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
              >
                {item.icon && <Icon name={item.icon} size={20} />}
                <span>
                  <span className="menu-label">{item.label}</span>
                  {item.hint && <span className="menu-hint">{item.hint}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
