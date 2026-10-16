import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetReactionsQuery } from "../../api";
import Avatar from "../../components/Avatar";
import Modal from "../../components/Modal";
import { REACTIONS } from "../../lib/reactions";
import ReactionBadge from "./ReactionBadge";

export default function ReactionsModal({ postId, onClose }) {
  const { data, isLoading } = useGetReactionsQuery(postId);
  const [tab, setTab] = useState("all");
  const all = data?.reactions ?? [];

  const counts = useMemo(() => {
    const c = {};
    for (const r of all) c[r.type] = (c[r.type] || 0) + 1;
    return c;
  }, [all]);

  const list = tab === "all" ? all : all.filter((r) => r.type === tab);

  return (
    <Modal title="Reactions" onClose={onClose} width={552}>
      <div className="rx-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "all"} className={`rx-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
          All {all.length}
        </button>
        {REACTIONS.filter((r) => counts[r.type]).map((r) => (
          <button
            key={r.type}
            type="button"
            role="tab"
            aria-selected={tab === r.type}
            aria-label={`${r.label} ${counts[r.type]}`}
            className={`rx-tab ${tab === r.type ? "active" : ""}`}
            onClick={() => setTab(r.type)}
          >
            <ReactionBadge type={r.type} size={20} /> {counts[r.type]}
          </button>
        ))}
      </div>
      {isLoading && <p className="muted" style={{ padding: 16 }}>Loading…</p>}
      <ul className="rx-people">
        {list.map((r) => (
          <li key={r.user.id}>
            <Link to={`/in/${r.user.id}`} className="rx-person" onClick={onClose}>
              <span className="rx-avatar">
                <Avatar user={r.user} size={48} />
                <span className="rx-avatar-badge">
                  <ReactionBadge type={r.type} size={18} />
                </span>
              </span>
              <span className="grow" style={{ minWidth: 0 }}>
                <span className="bold hover-underline">
                  {r.user.first_name} {r.user.last_name}
                </span>
                <span className="small muted clamp-2" style={{ display: "block" }}>
                  {r.user.headline}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
