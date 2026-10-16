import { Link } from "react-router-dom";
import { useDemoLoginMutation } from "../../api";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { Wordmark } from "../../components/Logo";
import useDocumentTitle from "../../lib/useDocumentTitle";
import { useOnSignedIn } from "./useSession";
import "./Auth.css";

const TOPICS = ["Marketing", "Public Administration", "Healthcare", "Engineering", "IT Services", "Sustainability", "Business Administration", "Telecommunications", "HR Management"];
const JOB_CATEGORIES = ["Engineering", "Business Development", "Finance", "Administrative Assistant", "Retail Associate", "Customer Service", "Operations", "Information Technology", "Marketing", "Human Resources"];
const GUEST_NAV = [
  { icon: "article", label: "Articles" },
  { icon: "network", label: "People" },
  { icon: "video", label: "Learning" },
  { icon: "jobs", label: "Jobs" },
];

export function GuestHeader({ minimal = false }) {
  return (
    <header className="guest-header">
      <Link to="/" aria-label="CareerLinker home">
        <Wordmark height={34} />
      </Link>
      {!minimal && (
        <nav className="guest-nav">
          <ul className="guest-nav-icons">
            {GUEST_NAV.map((n) => (
              <li key={n.label}>
                <Link to="/login" className="guest-nav-item">
                  <Icon name={n.icon} />
                  <span>{n.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Button variant="tertiary" size="md" to="/signup" className="guest-join">
            Join now
          </Button>
          <Button variant="secondary" size="md" to="/login">
            Sign in
          </Button>
        </nav>
      )}
    </header>
  );
}

function HeroArt() {
  // A friendly abstract illustration (no external assets).
  return (
    <svg viewBox="0 0 560 480" className="hero-art" role="img" aria-label="Professionals collaborating">
      <defs>
        <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d0e8ff" />
          <stop offset="1" stopColor="#f3e8d7" />
        </linearGradient>
      </defs>
      <path d="M86 92C150 18 286 6 384 46s172 136 150 236-120 168-236 176S70 418 42 318 22 166 86 92z" fill="url(#hg1)" />
      <rect x="120" y="210" width="320" height="16" rx="8" fill="#c9b79c" />
      <rect x="150" y="226" width="12" height="120" fill="#b79f7f" />
      <rect x="398" y="226" width="12" height="120" fill="#b79f7f" />
      <rect x="210" y="138" width="130" height="80" rx="6" fill="#1f2d3d" />
      <rect x="218" y="146" width="114" height="62" rx="3" fill="#0a66c2" />
      <rect x="230" y="160" width="60" height="6" rx="3" fill="#fff" opacity=".85" />
      <rect x="230" y="174" width="88" height="6" rx="3" fill="#fff" opacity=".55" />
      <rect x="230" y="188" width="40" height="6" rx="3" fill="#fff" opacity=".55" />
      <circle cx="140" cy="142" r="30" fill="#8f5849" />
      <path d="M92 252c0-50 22-82 48-82s48 32 48 82z" fill="#e7a33e" />
      <circle cx="420" cy="132" r="30" fill="#3d2b24" />
      <path d="M372 246c0-50 22-82 48-82s48 32 48 82z" fill="#378fe9" />
      <rect x="360" y="70" width="120" height="40" rx="20" fill="#fff" />
      <circle cx="384" cy="90" r="9" fill="#44712e" />
      <rect x="400" y="84" width="62" height="12" rx="6" fill="#d9d9d9" />
      <rect x="70" y="300" width="150" height="56" rx="10" fill="#fff" />
      <circle cx="96" cy="328" r="14" fill="#df704d" />
      <rect x="118" y="318" width="84" height="8" rx="4" fill="#d9d9d9" />
      <rect x="118" y="332" width="56" height="8" rx="4" fill="#e9e5df" />
    </svg>
  );
}

export default function Landing() {
  useDocumentTitle("Log In or Sign Up");
  const [demoLogin, { isLoading }] = useDemoLoginMutation();
  const onSignedIn = useOnSignedIn();

  const tryDemo = async () => {
    const res = await demoLogin();
    if (res.data) onSignedIn(res.data.user);
  };

  return (
    <div className="guest">
      <GuestHeader />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <h1 className="hero-title">Welcome to your professional community</h1>
            <div className="hero-actions">
              <Button variant="primary" size="lg" className="hero-btn" onClick={tryDemo} disabled={isLoading}>
                {isLoading ? "Signing you in…" : "Continue as demo user"}
              </Button>
              <Button variant="muted" size="lg" className="hero-btn" to="/login" icon="person">
                Sign in with email
              </Button>
              <p className="hero-legal">
                By clicking Continue to join or sign in, you agree to CareerLinker's <span className="link">User Agreement</span>,{" "}
                <span className="link">Privacy Policy</span>, and <span className="link">Cookie Policy</span>.
              </p>
              <p className="hero-join">
                New to CareerLinker? <Link to="/signup" className="link">Join now</Link>
              </p>
            </div>
          </div>
          <HeroArt />
        </section>

        <section className="guest-band">
          <div className="guest-band-inner">
            <h2 className="guest-h2">Explore collaborative articles</h2>
            <div>
              <p className="guest-lede">
                We're unlocking community knowledge in a new way. Experts add insights directly into each article, started with the help of AI.
              </p>
              <ul className="pill-cloud">
                {TOPICS.map((t) => (
                  <li key={t}>
                    <Link to="/login" className="topic-pill">{t}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/login" className="topic-pill topic-more">Show all</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="guest-band guest-band-alt">
          <div className="guest-band-inner">
            <h2 className="guest-h2 guest-h2-light">Find the right job or internship for you</h2>
            <div>
              <div className="pill-group-label">Suggested searches</div>
              <ul className="pill-cloud">
                {JOB_CATEGORIES.map((t) => (
                  <li key={t}>
                    <Link to="/login" className="topic-pill topic-pill-muted">{t}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="guest-band">
          <div className="guest-split">
            <div>
              <h2 className="guest-h2">Let the right people know you're open to work</h2>
              <p className="guest-lede">
                With the Open To Work feature, you can privately tell recruiters or publicly share with the CareerLinker community that you are looking for new job opportunities.
              </p>
            </div>
            <div className="open-card" aria-hidden="true">
              <div className="open-avatar">
                <span>#OPENTOWORK</span>
              </div>
              <div className="open-lines">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </section>

        <section className="guest-cta">
          <h2>Join your colleagues, classmates, and friends on CareerLinker.</h2>
          <Button variant="primary" size="lg" to="/signup">
            Get started
          </Button>
        </section>
      </main>
      <footer className="guest-footer">
        <Wordmark height={20} />
        <span>© {new Date().getFullYear()}</span>
        <span>About</span>
        <span>Accessibility</span>
        <span>User Agreement</span>
        <span>Privacy Policy</span>
        <span>Cookie Policy</span>
        <span>Brand Policy</span>
        <span>Community Guidelines</span>
      </footer>
    </div>
  );
}
