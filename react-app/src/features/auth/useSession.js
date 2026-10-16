import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api";

/** After any login/signup: drop stale caches, store the user, and go where they were headed. */
export function useOnSignedIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  return (user) => {
    dispatch(api.util.resetApiState());
    dispatch(api.util.upsertQueryData("getSession", undefined, { user }));
    navigate(location.state?.from || "/feed", { replace: true });
  };
}
