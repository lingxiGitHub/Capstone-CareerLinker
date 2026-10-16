import { useState } from "react";
import { Link } from "react-router-dom";
import { useDemoLoginMutation, useLoginMutation } from "../../api";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import useDocumentTitle from "../../lib/useDocumentTitle";
import { GuestHeader } from "./Landing";
import { useOnSignedIn } from "./useSession";
import "./Auth.css";

export function FloatingInput({ label, error, type = "text", trailing, ...props }) {
  return (
    <div className="float-field">
      <div className={`float-wrap ${error ? "invalid" : ""}`}>
        <input className="float-input" type={type} placeholder=" " aria-invalid={!!error} {...props} />
        <label className="float-label" htmlFor={props.id}>
          {label}
        </label>
        {trailing}
      </div>
      {error && (
        <div className="field-error" role="alert">
          <Icon name="error" size={16} /> {error}
        </div>
      )}
    </div>
  );
}

export default function Login() {
  useDocumentTitle("Sign In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [login, { isLoading }] = useLoginMutation();
  const [demoLogin, { isLoading: demoLoading }] = useDemoLoginMutation();
  const onSignedIn = useOnSignedIn();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login({ email, password });
    if (res.error) setError(res.error);
    else onSignedIn(res.data.user);
  };

  const demo = async () => {
    const res = await demoLogin();
    if (res.data) onSignedIn(res.data.user);
  };

  return (
    <div className="auth-page">
      <GuestHeader minimal />
      <main className="auth-main">
        <form className="auth-card" onSubmit={submit} noValidate>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-sub">Stay updated on your professional world</p>

          <Button variant="muted" size="lg" className="auth-wide" onClick={demo} disabled={demoLoading} icon="person">
            {demoLoading ? "Signing in…" : "Continue as demo user"}
          </Button>
          <div className="auth-or">
            <span>or</span>
          </div>

          <FloatingInput
            id="login-email"
            label="Email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <FloatingInput
            id="login-password"
            label="Password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error?.errors?.password || (error && !error.errors?.password ? error.message : null)}
            required
            trailing={
              <button type="button" className="float-trailing" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"}>
                {showPw ? "hide" : "show"}
              </button>
            }
          />
          <span className="link auth-forgot" title="Try the demo account: demo@careerlinker.io / password">
            Forgot password?
          </span>

          <Button variant="primary" size="lg" type="submit" className="auth-wide" disabled={isLoading || !email || !password}>
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="auth-switch">
          New to CareerLinker? <Link to="/signup" className="link">Join now</Link>
        </p>
      </main>
    </div>
  );
}
