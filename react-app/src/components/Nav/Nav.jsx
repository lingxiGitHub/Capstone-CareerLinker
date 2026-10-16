import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { api, useCurrentUser, useGetBadgesQuery, useLogoutMutation, useTypeaheadQuery } from "../../api";
import { useDispatch } from "react-redux";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { LogoMark } from "../Logo";
import Button from "../Button";
import "./Nav.css";

const ITEMS = [
  { to: "/feed", icon: "home", label: "Home" },
  { to: "/mynetwork", icon: "network", label: "My Network", badge: "network" },
  { to: "/jobs", icon: "jobs", label: "Jobs" },
  { to: "/messaging", icon: "messaging", label: "Messaging", badge: "messaging" },
  { to: "/notifications", icon: "bell", label: "Notifications", badge: "notifications" },
];

function useDebounced(value, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function SearchBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState(() => new URLSearchParams(location.search).get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const debounced = useDebounced(q.trim());
  const { data } = useTypeaheadQuery(debounced, { skip: debounced.length < 1 });
  const people = debounced ? data?.people ?? [] : [];
  const boxRef = useRef(null);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) setQ("");
  }, [location.pathname]);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setFocused(false);
    boxRef.current?.querySelector("input")?.blur();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form className={`nav-search ${focused ? "focused" : ""}`} onSubmit={submit} ref={boxRef} role="search">
      <Icon name="search" size={16} className="nav-search-icon" />
      <input
        type="search"
        placeholder="Search"
        aria-label="Search people, posts and jobs"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      {focused && q.trim() && (
        <div className="nav-typeahead">
          {people.map((p) => (
            <Link key={p.id} to={`/in/${p.id}`} className="typeahead-row" onClick={() => setFocused(false)}>
              <Avatar user={p} size={32} />
              <span className="truncate">
                <span className="bold">
                  {p.first_name} {p.last_name}
                </span>
                {p.headline && <span className="muted"> · {p.headline}</span>}
              </span>
            </Link>
          ))}
          <button type="submit" className="typeahead-row typeahead-all">
            <Icon name="search" size={20} />
            <span>
              See all results for <strong>{q.trim()}</strong>
            </span>
          </button>
        </div>
      )}
    </form>
  );
}

function MeMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const signOut = async () => {
    await logout();
    dispatch(api.util.resetApiState());
    navigate("/");
  };

  return (
    <div className="nav-me" ref={ref}>
      <button type="button" className={`nav-item ${open ? "active-menu" : ""}`} onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <Avatar user={user} size={24} />
        <span className="nav-label">
          Me <Icon name="caretDown" size={16} />
        </span>
      </button>
      {open && (
        <div className="me-dropdown" role="menu">
          <div className="me-head">
            <Avatar user={user} size={56} />
            <div className="grow">
              <div className="bold me-name">
                {user.first_name} {user.last_name}
              </div>
              <div className="small">{user.headline}</div>
            </div>
          </div>
          <div className="me-actions">
            <Button variant="secondary" size="sm" to={`/in/${user.id}`} style={{ width: "100%" }} onClick={() => setOpen(false)}>
              View Profile
            </Button>
          </div>
          <hr className="divider" />
          <div className="me-section">
            <div className="me-section-title">Manage</div>
            <Link to="/jobs?view=saved" className="me-link" onClick={() => setOpen(false)}>
              Saved jobs
            </Link>
            <Link to="/mynetwork/connections" className="me-link" onClick={() => setOpen(false)}>
              Connections
            </Link>
          </div>
          <hr className="divider" />
          <button type="button" className="me-link me-signout" onClick={signOut}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const user = useCurrentUser();
  const { data: badges } = useGetBadgesQuery(undefined, { skip: !user, pollingInterval: 20000 });

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/feed" className="nav-logo" aria-label="CareerLinker home">
          <LogoMark size={34} />
        </Link>
        <SearchBox />
        <nav className="nav-items" aria-label="Primary">
          {ITEMS.map((item) => {
            const count = item.badge ? badges?.[item.badge] ?? 0 : 0;
            return (
              <NavLink key={item.to} to={item.to} className="nav-item">
                <span className="nav-icon">
                  <Icon name={item.icon} />
                  {count > 0 && <span className="nav-badge">{count > 99 ? "99+" : count}</span>}
                </span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
          <MeMenu user={user} />
        </nav>
      </div>
    </header>
  );
}
