import { useState } from "react";
import { Link } from "react-router-dom";
import { useSignupMutation } from "../../api";
import Button from "../../components/Button";
import useDocumentTitle from "../../lib/useDocumentTitle";
import { GuestHeader } from "./Landing";
import { FloatingInput } from "./Login";
import { useOnSignedIn } from "./useSession";
import "./Auth.css";

const STEP_FIELDS = [
  ["email", "password"],
  ["first_name", "last_name"],
  ["headline", "location"],
];

function validate(step, form) {
  const errors = {};
  if (step === 0) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = "Please enter a valid email address";
    if (form.password.length < 6) errors.password = "Password must be 6 characters or more";
  }
  if (step === 1) {
    if (!form.first_name.trim()) errors.first_name = "Please enter your first name";
    if (!form.last_name.trim()) errors.last_name = "Please enter your last name";
  }
  return errors;
}

export default function Signup() {
  useDocumentTitle("Sign Up");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ email: "", password: "", first_name: "", last_name: "", headline: "", location: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [signup, { isLoading }] = useSignupMutation();
  const onSignedIn = useOnSignedIn();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const next = async (e) => {
    e.preventDefault();
    setFormError(null);
    const errs = validate(step, form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (step < 2) return setStep(step + 1);

    const res = await signup(form);
    if (res.data) return onSignedIn(res.data.user);
    const serverErrors = res.error.errors || {};
    setErrors(serverErrors);
    // Jump back to the step that owns the first failing field.
    const badStep = STEP_FIELDS.findIndex((fields) => fields.some((f) => serverErrors[f]));
    if (badStep >= 0) setStep(badStep);
    else setFormError(res.error.message);
  };

  const titles = ["Make the most of your professional life", "Make the most of your professional life", "Your profile helps you discover new people and opportunities"];

  return (
    <div className="auth-page">
      <GuestHeader minimal />
      <main className="auth-main">
        <h1 className="signup-heading">{titles[step]}</h1>
        <form className="auth-card signup-card" onSubmit={next} noValidate>
          <div className="signup-steps" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={i <= step ? "on" : ""} />
            ))}
          </div>
          {formError && <div className="form-error">{formError}</div>}

          {step === 0 && (
            <>
              <FloatingInput id="su-email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} autoFocus />
              <FloatingInput id="su-password" label="Password (6+ characters)" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} error={errors.password} />
              <p className="hero-legal">
                By clicking Agree &amp; Join, you agree to the CareerLinker <span className="link">User Agreement</span>, <span className="link">Privacy Policy</span>, and{" "}
                <span className="link">Cookie Policy</span>.
              </p>
            </>
          )}
          {step === 1 && (
            <>
              <FloatingInput id="su-first" label="First name" autoComplete="given-name" value={form.first_name} onChange={set("first_name")} error={errors.first_name} autoFocus />
              <FloatingInput id="su-last" label="Last name" autoComplete="family-name" value={form.last_name} onChange={set("last_name")} error={errors.last_name} />
            </>
          )}
          {step === 2 && (
            <>
              <FloatingInput id="su-headline" label="Most recent job title (optional)" value={form.headline} onChange={set("headline")} error={errors.headline} autoFocus />
              <FloatingInput id="su-location" label="Location (optional)" autoComplete="address-level2" value={form.location} onChange={set("location")} error={errors.location} />
            </>
          )}

          <Button variant="primary" size="lg" type="submit" className="auth-wide" disabled={isLoading}>
            {step === 0 ? "Agree & Join" : step === 1 ? "Continue" : isLoading ? "Creating your profile…" : "Finish"}
          </Button>
          {step > 0 && (
            <Button variant="tertiary" size="md" className="auth-wide" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <p className="auth-switch" style={{ marginTop: 16 }}>
            Already on CareerLinker? <Link to="/login" className="link">Sign in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
