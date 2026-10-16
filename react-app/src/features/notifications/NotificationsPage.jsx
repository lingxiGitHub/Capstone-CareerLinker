import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser, useGetNotificationsQuery, useMarkNotificationsSeenMutation } from "../../api";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Menu from "../../components/Menu";
import RailFooter from "../../components/RailFooter";
import { REACTION_BY_TYPE } from "../../lib/reactions";
import { timeAgo } from "../../lib/time";
import useDocumentTitle from "../../lib/useDocumentTitle";
import "./Notifications.css";

const FILTERS = [
  { key: "all", label: "All", kinds: null },
  { key: "posts", label: "My posts", kinds: ["reaction", "comment"] },
  { key: "network", label: "Network", kinds: ["invitation", "connection_accepted"] },
];

function Badge({ n }) {
  if (n.kind === "reaction") {
    const r = REACTION_BY_TYPE[n.reaction] ?? REACTION_BY_TYPE.like;
    return (
      <span className="ntf-badge" style={{ background: r.color }} aria-hidden="true">
        {r.emoji}
      </span>
    );
  }
  return (
    <span className="ntf-badge" style={{ background: n.kind === "comment" ? "var(--brand)" : "var(--success)" }} aria-hidden="true">
      <Icon name={n.kind === "comment" ? "comment" : "person"} size={12} />
    </span>
  );
}

function Text({ n }) {
  const name = (
    <strong>
      {n.actor.first_name} {n.actor.last_name}
    </strong>
  );
  switch (n.kind) {
    case "reaction": {
      const r = REACTION_BY_TYPE[n.reaction] ?? REACTION_BY_TYPE.like;
      return (
        <>
          {name} reacted {r.emoji} to your post: <span className="muted">“{n.snippet}”</span>
        </>
      );
    }
    case "comment":
      return (
        <>
          {name} commented on your post: <span className="muted">“{n.snippet}”</span>
        </>
      );
    case "connection_accepted":
      return <>{name} accepted your invitation. Send a message to say hello.</>;
    default:
      return <>{name} sent you an invitation to connect.</>;
  }
}

function NotificationItem({ n, onHide }) {
  const navigate = useNavigate();
  const target = n.post_id ? "/feed" : `/in/${n.actor.id}`;
  const open = () => navigate(target);

  return (
    <li
      className={`ntf-item ${n.unread ? "unread" : ""}`}
      onClick={(e) => !e.target.closest("button, a") && open()}
    >
      {n.unread && <span className="ntf-dot" aria-label="Unread" />}
      <Link to={`/in/${n.actor.id}`} className="ntf-avatar">
        <Avatar user={n.actor} size={48} />
        <Badge n={n} />
      </Link>
      <div className="grow ntf-body">
        <Link to={target} className="ntf-text">
          <Text n={n} />
        </Link>
        {n.kind === "invitation" && (
          <div className="ntf-cta">
            <Button variant="secondary" size="sm" to="/mynetwork">
              View
            </Button>
          </div>
        )}
        {n.kind === "connection_accepted" && (
          <div className="ntf-cta">
            <Button variant="secondary" size="sm" to={`/messaging?to=${n.actor.id}`}>
              Message
            </Button>
          </div>
        )}
      </div>
      <div className="ntf-side">
        <span className="small muted">{timeAgo(n.created_at)}</span>
        <Menu
          label="Notification settings"
          items={[{ icon: "trash", label: "Delete notification", onClick: onHide }]}
        />
      </div>
    </li>
  );
}

export default function NotificationsPage() {
  const user = useCurrentUser();
  // Fetch fresh on every visit; keep this response so unread styling survives marking as seen.
  const { data, isLoading } = useGetNotificationsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [markSeen] = useMarkNotificationsSeenMutation();
  const [filter, setFilter] = useState("all");
  const [hidden, setHidden] = useState(() => new Set());
  const marked = useRef(false);
  useDocumentTitle("Notifications");

  useEffect(() => {
    if (data && !marked.current) {
      marked.current = true;
      markSeen();
    }
  }, [data, markSeen]);

  const kinds = FILTERS.find((f) => f.key === filter).kinds;
  const items = (data?.notifications ?? []).filter((n) => !hidden.has(n.id) && (!kinds || kinds.includes(n.kind)));

  return (
    <main className="page ntf-layout">
      <aside className="ntf-left">
        <section className="card ntf-me">
          <div className="ntf-me-banner" style={user?.banner_photo ? { backgroundImage: `url(${user.banner_photo})` } : undefined} />
          <Link to={`/in/${user?.id}`} className="ntf-me-link">
            <Avatar user={user} size={72} ring className="ntf-me-avatar" />
            <span className="bold hover-underline" style={{ fontSize: 16 }}>
              {user?.first_name} {user?.last_name}
            </span>
          </Link>
          <p className="small muted ntf-me-headline">{user?.headline}</p>
          <hr className="divider" />
          <div className="ntf-me-settings">
            <div className="bold">Manage your notifications</div>
            <span className="link">View settings</span>
          </div>
        </section>
      </aside>

      <section className="ntf-main">
        <div className="card ntf-filters" role="tablist" aria-label="Filter notifications">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              className={`ntf-pill ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="card">
          {isLoading ? (
            <ul>
              {Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="ntf-item">
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
                  <div className="grow stack" style={{ gap: 8 }}>
                    <div className="skeleton" style={{ width: "80%", height: 12 }} />
                    <div className="skeleton" style={{ width: "50%", height: 12 }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : items.length === 0 ? (
            <div className="ntf-empty">
              <Icon name="bell" size={48} style={{ color: "var(--text-tertiary)", margin: "0 auto 12px" }} />
              <p className="bold" style={{ fontSize: 16 }}>No new notifications</p>
              <p className="muted">When people react to your posts or want to connect, you'll see it here.</p>
            </div>
          ) : (
            <ul>
              {items.map((n) => (
                <NotificationItem key={n.id} n={n} onHide={() => setHidden((h) => new Set(h).add(n.id))} />
              ))}
            </ul>
          )}
        </div>
      </section>

      <aside className="ntf-right">
        <RailFooter />
      </aside>
    </main>
  );
}
