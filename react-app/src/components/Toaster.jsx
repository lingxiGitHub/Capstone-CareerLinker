import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dismissToast, pushToast } from "./toastSlice";
import Icon from "./Icon";
import "./Toaster.css";

export function useToast() {
  const dispatch = useDispatch();
  return (message, kind) => dispatch(pushToast(message, kind));
}

function Toast({ toast }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissToast(toast.id)), 4000);
    return () => clearTimeout(t);
  }, [dispatch, toast.id]);
  return (
    <div className={`toast toast-${toast.kind}`} role="status">
      <Icon name={toast.kind === "error" ? "error" : "check"} size={20} className="toast-icon" />
      <span className="grow">{toast.message}</span>
      <button type="button" aria-label="Dismiss" onClick={() => dispatch(dismissToast(toast.id))}>
        <Icon name="close" size={20} />
      </button>
    </div>
  );
}

export default function Toaster() {
  const toasts = useSelector((s) => s.toasts);
  return (
    <div className="toaster">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}
