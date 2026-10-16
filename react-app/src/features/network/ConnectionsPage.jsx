import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetConnectionsQuery, useRemoveConnectionMutation } from "../../api";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Menu from "../../components/Menu";
import RailFooter from "../../components/RailFooter";
import { useToast } from "../../components/Toaster";
import { timeAgoLong } from "../../lib/time";
import useDocumentTitle from "../../lib/useDocumentTitle";
import "./Network.css";

const SORTS = {
  recent: (a, b) => new Date(b.connected_at) - new Date(a.connected_at),
  first: (a, b) => a.first_name.localeCompare(b.first_name),
  last: (a, b) => a.last_name.localeCompare(b.last_name),
};

function ConnectionRow({ person }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [remove] = useRemoveConnectionMutation();
  const name = `${person.first_name} ${person.last_name}`;

  return (
    <li className="net-conn-row">
      <Link to={`/in/${person.id}`}>
        <Avatar user={person} size={72} />
      </Link>
      <div className="grow">
        <Link to={`/in/${person.id}`} className="bold hover-underline" style={{ fontSize: 16 }}>
          {name}
        </Link>
        <div className="muted clamp-2">{person.headline}</div>
        {person.connected_at && <div className="subtle small">Connected {timeAgoLong(person.connected_at)}</div>}
      </div>
      <Button variant="secondary" size="sm" onClick={() => navigate(`/messaging?to=${person.id}`)}>
        Message
      </Button>
      <Menu
        label={`More actions for ${name}`}
        items={[
          {
            icon: "personRemove",
            label: "Remove connection",
            onClick: async () => {
              if (!window.confirm(`Remove ${name} from your connections?`)) return;
              const res = await remove(person.id);
              if (res.error) toast(res.error.message, "error");
              else toast(`${name} was removed from your connections`);
            },
          },
        ]}
      />
    </li>
  );
}

export default function ConnectionsPage() {
  const { data, isLoading } = useGetConnectionsQuery();
  const [sort, setSort] = useState("recent");
  const [q, setQ] = useState("");
  useDocumentTitle("Connections");

  const all = data?.connections ?? [];
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all
      .filter((p) => !needle || `${p.first_name} ${p.last_name}`.toLowerCase().includes(needle))
      .sort(SORTS[sort]);
  }, [all, q, sort]);

  return (
    <main className="page net-conn-layout">
      <section className="card">
        <header className="net-conn-head">
          <h1 className="net-conn-title">{isLoading ? "Connections" : `${all.length} Connection${all.length === 1 ? "" : "s"}`}</h1>
        </header>
        <div className="net-conn-tools">
          <label className="muted">
            Sort by:{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recent">Recently added</option>
              <option value="first">First name</option>
              <option value="last">Last name</option>
            </select>
          </label>
          <div className="net-conn-search">
            <Icon name="search" size={16} />
            <input className="input" type="search" placeholder="Search by name" aria-label="Search connections by name" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        {isLoading ? (
          <div className="net-conn-row">
            <div className="skeleton" style={{ width: 72, height: 72, borderRadius: "50%" }} />
            <div className="grow stack" style={{ gap: 8 }}>
              <div className="skeleton" style={{ width: "35%", height: 14 }} />
              <div className="skeleton" style={{ width: "60%", height: 12 }} />
            </div>
          </div>
        ) : list.length === 0 ? (
          <div className="net-empty">
            <p className="bold" style={{ fontSize: 16 }}>{all.length ? "No connections match your search" : "You don't have any connections yet"}</p>
            {!all.length && (
              <p className="muted" style={{ margin: "8px 0 16px" }}>
                Grow your network by connecting with people you know.
              </p>
            )}
            {!all.length && (
              <Button variant="secondary" to="/mynetwork">
                Find people
              </Button>
            )}
          </div>
        ) : (
          <ul>
            {list.map((p) => (
              <ConnectionRow key={p.id} person={p} />
            ))}
          </ul>
        )}
      </section>
      <aside>
        <section className="card net-promo">
          <Icon name="network" size={40} style={{ color: "var(--brand)", margin: "0 auto" }} />
          <p className="muted">Manage synced and imported contacts to grow your network faster.</p>
          <Button variant="secondary" size="sm" to="/mynetwork">
            Find more people
          </Button>
        </section>
        <RailFooter />
      </aside>
    </main>
  );
}
