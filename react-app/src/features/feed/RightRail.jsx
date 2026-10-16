import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser, useGetSuggestionsQuery } from "../../api";
import Avatar from "../../components/Avatar";
import Icon from "../../components/Icon";
import ConnectButton from "../../components/ConnectButton";
import RailFooter from "../../components/RailFooter";
import Button from "../../components/Button";

const NEWS = [
  ["Hiring rebounds in tech sector", "4h ago", "8,412"],
  ["Four-day workweek pilots expand", "6h ago", "5,903"],
  ["AI skills top employer wish lists", "9h ago", "12,280"],
  ["Remote roles get more competitive", "12h ago", "3,771"],
  ["Gen Z rethinks the corporate ladder", "1d ago", "2,650"],
  ["Small businesses lean into upskilling", "1d ago", "1,948"],
  ["Return-to-office deadlines loom", "2d ago", "6,120"],
  ["Salary transparency laws spread", "2d ago", "4,309"],
];

function News() {
  const [more, setMore] = useState(false);
  const items = more ? NEWS : NEWS.slice(0, 5);
  return (
    <section className="card feed-news">
      <div className="feed-news-head">
        <h2 className="feed-rail-title">CareerLinker News</h2>
        <Icon name="info" size={16} className="muted" />
      </div>
      <h3 className="feed-news-sub">Top stories</h3>
      <ul>
        {items.map(([title, when, readers]) => (
          <li key={title}>
            <Link to={`/search?q=${encodeURIComponent(title.split(" ")[0])}`} className="feed-news-item">
              <span className="feed-news-title truncate">{title}</span>
              <span className="feed-news-meta">
                {when} • {readers} readers
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" className="feed-news-more" onClick={() => setMore((m) => !m)}>
        Show {more ? "less" : "more"}
        <Icon name="caretDown" size={16} style={more ? { transform: "rotate(180deg)" } : undefined} />
      </button>
    </section>
  );
}

function AddToFeed() {
  const { data } = useGetSuggestionsQuery(3);
  const people = data?.people ?? [];
  if (!data) return null;
  return (
    <section className="card feed-suggest">
      <div className="feed-news-head">
        <h2 className="feed-rail-title">Add to your feed</h2>
        <Icon name="info" size={16} className="muted" />
      </div>
      {people.length === 0 && <p className="muted small">You're connected with everyone. Nice!</p>}
      <ul>
        {people.map((p) => (
          <li key={p.id} className="feed-suggest-row">
            <Link to={`/in/${p.id}`}>
              <Avatar user={p} size={48} />
            </Link>
            <div className="grow">
              <Link to={`/in/${p.id}`} className="bold hover-underline">
                {p.first_name} {p.last_name}
              </Link>
              <p className="small muted clamp-2">{p.headline}</p>
              <div style={{ marginTop: 8 }}>
                <ConnectButton user={p} status="none" size="sm" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/mynetwork" className="feed-suggest-all">
        View all recommendations <Icon name="forward" size={16} />
      </Link>
    </section>
  );
}

function Promo() {
  const user = useCurrentUser();
  return (
    <section className="card feed-promo">
      <p className="feed-promo-ad">Ad</p>
      <p className="small muted">{user?.first_name}, unlock your full potential with CareerLinker Premium</p>
      <div className="feed-promo-imgs">
        <Avatar user={user} size={64} />
        <span className="feed-promo-badge">
          <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="4" fill="#e7a33e" />
            <path d="M20 20a3.36 3.36 0 001-2.39V6.38A3.38 3.38 0 0017.62 3H6.38A3.36 3.36 0 004 4z" fill="#f8c77e" />
          </svg>
        </span>
      </div>
      <p className="feed-promo-copy">See who's viewed your profile in the last 90 days</p>
      <Button variant="secondary" size="sm">
        Try for free
      </Button>
    </section>
  );
}

export default function RightRail() {
  return (
    <div className="feed-sticky">
      <News />
      <AddToFeed />
      <Promo />
      <RailFooter />
    </div>
  );
}
