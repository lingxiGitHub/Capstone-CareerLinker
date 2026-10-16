import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAcceptInvitationMutation,
  useGetConnectionsQuery,
  useGetInvitationsQuery,
  useGetSuggestionsQuery,
  useIgnoreInvitationMutation,
} from "../../api";
import Avatar from "../../components/Avatar";
import Button, { IconButton } from "../../components/Button";
import ConnectButton from "../../components/ConnectButton";
import Icon from "../../components/Icon";
import RailFooter from "../../components/RailFooter";
import { useToast } from "../../components/Toaster";
import { timeAgoLong } from "../../lib/time";
import useDocumentTitle from "../../lib/useDocumentTitle";
import "./Network.css";

const MANAGE_ROWS = [
  { icon: "person", label: "Contacts" },
  { icon: "network", label: "Following & followers" },
  { icon: "company", label: "Groups" },
  { icon: "clock", label: "Events" },
  { icon: "company", label: "Pages", count: 12 },
  { icon: "article", label: "Newsletters", count: 3 },
];

export function ManageNetworkCard() {
  const { data } = useGetConnectionsQuery();
  const count = data?.connections?.length;
  return (
    <section className="card net-manage" aria-label="Manage my network">
      <h2 className="net-manage-title">Manage my network</h2>
      <ul>
        <li>
          <Link to="/mynetwork/connections" className="net-manage-row">
            <Icon name="network" />
            <span className="grow">Connections</span>
            <span>{count ?? ""}</span>
          </Link>
        </li>
        {MANAGE_ROWS.map((r) => (
          <li key={r.label}>
            <span className="net-manage-row net-manage-static">
              <Icon name={r.icon} />
              <span className="grow">{r.label}</span>
              {r.count && <span>{r.count}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function InvitationRow({ inv, sent }) {
  const [accept, { isLoading: accepting }] = useAcceptInvitationMutation();
  const [ignore, { isLoading: ignoring }] = useIgnoreInvitationMutation();
  const toast = useToast();
  const u = inv.user;
  const name = `${u.first_name} ${u.last_name}`;

  return (
    <li className="net-inv">
      <Link to={`/in/${u.id}`}>
        <Avatar user={u} size={72} />
      </Link>
      <div className="grow">
        <Link to={`/in/${u.id}`} className="bold hover-underline net-inv-name">
          {name}
        </Link>
        <div className="muted clamp-2">{u.headline}</div>
        <div className="subtle small">{timeAgoLong(inv.created_at)}</div>
        {inv.message && <p className="net-inv-msg">“{inv.message}”</p>}
      </div>
      <div className="net-inv-actions">
        {sent ? (
          <Button
            variant="tertiary"
            size="sm"
            disabled={ignoring}
            onClick={async () => {
              const res = await ignore(inv.id);
              if (res.error) toast(res.error.message, "error");
              else toast(`Invitation to ${u.first_name} withdrawn`);
            }}
          >
            Withdraw
          </Button>
        ) : (
          <>
            <Button
              variant="tertiary"
              size="sm"
              disabled={ignoring || accepting}
              onClick={async () => {
                const res = await ignore(inv.id);
                if (res.error) toast(res.error.message, "error");
                else toast(`Invitation from ${u.first_name} ignored`);
              }}
            >
              Ignore
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={ignoring || accepting}
              onClick={async () => {
                const res = await accept(inv.id);
                if (res.error) toast(res.error.message, "error");
                else toast(`You're now connected with ${name}`);
              }}
            >
              Accept
            </Button>
          </>
        )}
      </div>
    </li>
  );
}

function InvitationsCard() {
  const { data, isLoading } = useGetInvitationsQuery();
  const [tab, setTab] = useState("received");
  const [expanded, setExpanded] = useState(false);
  const list = data?.[tab] ?? [];
  const shown = expanded ? list : list.slice(0, 3);

  return (
    <section className="card" aria-label="Invitations">
      <header className="net-card-head">
        <h2 className="net-card-title">Invitations{data ? ` (${data.received.length})` : ""}</h2>
        <div className="net-tabs" role="tablist">
          {["received", "sent"].map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={`net-tab ${tab === t ? "active" : ""}`}
              onClick={() => {
                setTab(t);
                setExpanded(false);
              }}
            >
              {t === "received" ? "Received" : "Sent"}
              {data && ` (${data[t].length})`}
            </button>
          ))}
        </div>
      </header>
      <hr className="divider" />
      {isLoading ? (
        <div className="net-inv">
          <div className="skeleton" style={{ width: 72, height: 72, borderRadius: "50%" }} />
          <div className="grow stack" style={{ gap: 8 }}>
            <div className="skeleton" style={{ width: "40%", height: 14 }} />
            <div className="skeleton" style={{ width: "70%", height: 12 }} />
          </div>
        </div>
      ) : list.length === 0 ? (
        <p className="net-empty muted">{tab === "received" ? "No pending invitations" : "No sent invitations"}</p>
      ) : (
        <ul>
          {shown.map((inv) => (
            <InvitationRow key={inv.id} inv={inv} sent={tab === "sent"} />
          ))}
        </ul>
      )}
      {list.length > 3 && (
        <button type="button" className="show-all" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Show less" : `Show all ${list.length}`}
        </button>
      )}
    </section>
  );
}

function SuggestionCard({ person, sent, onDismiss, onConnectClick }) {
  return (
    <li className="net-pymk">
      <div
        className="net-pymk-banner"
        style={person.banner_photo ? { backgroundImage: `url(${person.banner_photo})` } : undefined}
      />
      <IconButton icon="close" label={`Dismiss ${person.first_name}`} size={20} className="net-pymk-dismiss" onClick={onDismiss} />
      <Link to={`/in/${person.id}`} className="net-pymk-link">
        <Avatar user={person} size={104} ring className="net-pymk-avatar" />
        <span className="bold net-pymk-name hover-underline">
          {person.first_name} {person.last_name}
        </span>
        <span className="muted small clamp-2 net-pymk-headline">{person.headline}</span>
      </Link>
      <div className="net-pymk-foot" onClickCapture={onConnectClick}>
        <div className="subtle small net-pymk-mutual">
          {person.mutual_count > 0 && (
            <>
              <Icon name="network" size={16} />
              {person.mutual_count} mutual connection{person.mutual_count > 1 ? "s" : ""}
            </>
          )}
        </div>
        <ConnectButton user={person} status={sent ? "pending_sent" : "none"} size="sm" fullWidth />
      </div>
    </li>
  );
}

function SuggestionsCard() {
  const { data, isLoading } = useGetSuggestionsQuery(12);
  const [dismissed, setDismissed] = useState(() => new Set());
  // Suggestions are invalidated after a connect, so remember the people we just invited
  // to keep their card visible in the "Pending" state.
  const [kept, setKept] = useState({});
  const { data: invitations } = useGetInvitationsQuery();
  const sentIds = new Set((invitations?.sent ?? []).map((i) => i.user.id));

  const people = [...(data?.people ?? [])];
  for (const p of Object.values(kept)) if (!people.some((x) => x.id === p.id)) people.push(p);
  const visible = people.filter((p) => !dismissed.has(p.id));

  return (
    <section className="card" aria-label="People you may know">
      <header className="net-card-head">
        <h2 className="net-card-title">People you may know</h2>
      </header>
      {isLoading ? (
        <ul className="net-pymk-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="net-pymk">
              <div className="skeleton" style={{ height: 230 }} />
            </li>
          ))}
        </ul>
      ) : visible.length === 0 ? (
        <p className="net-empty muted">No suggestions right now — check back later.</p>
      ) : (
        <ul className="net-pymk-grid">
          {visible.map((p) => (
            <SuggestionCard
              key={p.id}
              person={p}
              sent={sentIds.has(p.id)}
              onDismiss={() => setDismissed((d) => new Set(d).add(p.id))}
              onConnectClick={() => !kept[p.id] && setKept((k) => ({ ...k, [p.id]: p }))}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default function NetworkPage() {
  const { data } = useGetInvitationsQuery();
  useDocumentTitle("My Network", data?.received?.length ?? 0);

  return (
    <main className="page net-layout">
      <aside className="net-left">
        <ManageNetworkCard />
        <RailFooter />
      </aside>
      <div className="net-main">
        <InvitationsCard />
        <SuggestionsCard />
      </div>
    </main>
  );
}
