import { Link } from "react-router-dom";
import { useCurrentUser, useGetConnectionsQuery } from "../../api";
import Avatar from "../../components/Avatar";
import Icon from "../../components/Icon";

export default function LeftRail() {
  const user = useCurrentUser();
  const { data } = useGetConnectionsQuery();
  if (!user) return null;
  const count = data?.connections?.length;

  return (
    <div className="feed-sticky">
      <section className="card feed-profile">
        <div
          className="feed-profile-banner"
          style={user.banner_photo ? { backgroundImage: `url(${user.banner_photo})` } : undefined}
        />
        <Link to={`/in/${user.id}`} className="feed-profile-avatar">
          <Avatar user={user} size={72} ring />
        </Link>
        <div className="feed-profile-id">
          <Link to={`/in/${user.id}`} className="feed-profile-name">
            {user.first_name} {user.last_name}
          </Link>
          {user.headline && <p className="feed-profile-headline">{user.headline}</p>}
          {user.location && <p className="feed-profile-loc">{user.location}</p>}
        </div>
        <hr className="divider" />
        <div className="feed-stats">
          <Link to={`/in/${user.id}`} className="feed-stat">
            <span className="muted">Profile viewers</span>
            <span className="feed-stat-num">{38 + (user.id % 7) * 11}</span>
          </Link>
          <Link to="/mynetwork/connections" className="feed-stat">
            <span>
              <span className="muted">Connections</span>
              <span className="feed-stat-sub">Grow your network</span>
            </span>
            <span className="feed-stat-num">{count ?? "–"}</span>
          </Link>
        </div>
        <hr className="divider" />
        <Link to="/jobs?view=saved" className="feed-saved">
          <Icon name="bookmarkFilled" size={16} />
          Saved items
        </Link>
      </section>

      <section className="card feed-recent">
        <h3 className="small bold">Recent</h3>
        <ul>
          {["Product Management", "Social Media Marketing", "Remote Work"].map((t) => (
            <li key={t}>
              <Link to={`/search?q=${encodeURIComponent(t.split(" ")[0])}`} className="feed-recent-item">
                <Icon name="network" size={16} /> {t}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
