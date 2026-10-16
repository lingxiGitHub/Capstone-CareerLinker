import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "./Button";
import "./Modal.css";

/** Accessible dialog: Escape and backdrop click close it, focus moves inside on open. */
export default function Modal({ title, onClose, children, footer, width = 552, className = "" }) {
  const ref = useRef(null);
  // Keep the latest onClose without re-running the mount effect (which would steal focus).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCloseRef.current();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = ref.current?.querySelector("input, textarea, select, button:not(.modal-close)");
    first?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`modal ${className}`} style={{ maxWidth: width }} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <IconButton icon="close" label="Dismiss" className="modal-close" onClick={onClose} />
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}
