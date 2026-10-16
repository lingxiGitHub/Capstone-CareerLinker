import { useSearchParams, Link } from "react-router-dom";
import { useSearchQuery } from "../../api";
import Avatar, { OrgLogo } from "../../components/Avatar";
import ConnectButton from "../../components/ConnectButton";
import RailFooter from "../../components/RailFooter";
import { timeAgo } from "../../lib/time";
import useDocumentTitle from "../../lib/useDocumentTitle";
import PostCard from "../feed/PostCard";
import "./Search.css";

const TABS = [
  { key: "all", label: "All" },
  { key: "people", label: "People" },
  { key: "posts", label: "Posts" },
  { key: "jobs", label: "Jobs" },
];

function PersonRow({ p }) {
  return (
    <li className="srch-row">
      <Link to={`/in/${p.id}`}>
        <Avatar user={p} size={56} />
      </Link>
      <div className="grow">
        <Link to={`/in/${p.id}`} className="bold hover-underline srch-name">
          {p.first_name} {p.last_name}
        </Link>
        {p.connection_status === "connected" && <span className="muted"> • 1st</span>}
        {p.connection_status === "self" && <span className="muted"> • You</span>}
        <div className="clamp-2">{p.headline}</div>
        {p.location && <div className="muted small">{p.location}</div>}
      </div>
      <ConnectButton user={p} status={p.connection_status} size="sm" />
    </li>
  );
}

function JobRow({ j }) {
  return (
    <li className="srch-row">
      <OrgLogo name={j.company} size={56} />
      <div className="grow">
        <Link to={`/jobs?currentJobId=${j.id}`} className="srch-job-title">
          {j.title}
        </Link>
        <div>{j.company}</div>
        <div className="muted small">
          {j.location} ({j.workplace_type})
        </div>
        <div className="subtle small">{timeAgo(j.created_at)} ago</div>
      </div>
    </li>
  );
}

function Section({ title, children, footer }) {
  return (
    <section className="card srch-section">
      <h2 className="srch-section-title">{title}</h2>
      <ul>{children}</ul>
      {footer}
    </section>
  );
}

function Empty() {
  return (
    <section className="card srch-empty">
      <svg width="200" height="140" viewBox="0 0 200 140" aria-hidden="true">
        <rect x="20" y="20" width="160" height="100" rx="10" fill="#e9e5df" />
        <circle cx="90" cy="68" r="26" fill="none" stroke="#0a66c2" strokeWidth="8" opacity=".45" />
        <path d="M108 86l26 24" stroke="#0a66c2" strokeWidth="10" strokeLinecap="round" opacity=".45" />
      </svg>
      <h2>No results found</h2>
      <p className="muted">Try shortening or rephrasing your search.</p>
    </section>
  );
}

function Skeleton() {
  return (
    <section className="card srch-section">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="srch-row">
          <div className="skeleton" style={{ width: 56, height: 56, borderRadius: "50%" }} />
          <div className="grow stack" style={{ gap: 8 }}>
            <div className="skeleton" style={{ width: "40%", height: 14 }} />
            <div className="skeleton" style={{ width: "70%", height: 12 }} />
          </div>
        </div>
      ))}
    </section>
  );
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const tab = TABS.some((t) => t.key === params.get("type")) ? params.get("type") : "all";
  const { data, isFetching } = useSearchQuery(q, { skip: !q });
  useDocumentTitle(q ? `${q} - Search` : "Search");

  const setTab = (key) => {
    const next = new URLSearchParams(params);
    if (key === "all") next.delete("type");
    else next.set("type", key);
    setParams(next);
    window.scrollTo(0, 0);
  };

  const people = data?.people ?? [];
  const posts = data?.posts ?? [];
  const jobs = data?.jobs ?? [];
  const nothing =
    tab === "all" ? !people.length && !posts.length && !jobs.length : !(tab === "people" ? people : tab === "posts" ? posts : jobs).length;

  const seeAll = (key, label) => (
    <button type="button" className="show-all" onClick={() => setTab(key)}>
      See all {label} results
    </button>
  );

  let body;
  if (!q) body = <Empty />;
  else if (isFetching && !data) body = <Skeleton />;
  else if (nothing) body = <Empty />;
  else if (tab === "people")
    body = (
      <Section title="People">
        {people.map((p) => (
          <PersonRow key={p.id} p={p} />
        ))}
      </Section>
    );
  else if (tab === "jobs")
    body = (
      <Section title="Jobs">
        {jobs.map((j) => (
          <JobRow key={j.id} j={j} />
        ))}
      </Section>
    );
  else if (tab === "posts")
    body = (
      <div className="srch-posts">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    );
  else
    body = (
      <>
        {people.length > 0 && (
          <Section title="People" footer={people.length > 3 && seeAll("people", "people")}>
            {people.slice(0, 3).map((p) => (
              <PersonRow key={p.id} p={p} />
            ))}
          </Section>
        )}
        {jobs.length > 0 && (
          <Section title="Jobs" footer={jobs.length > 3 && seeAll("jobs", "job")}>
            {jobs.slice(0, 3).map((j) => (
              <JobRow key={j.id} j={j} />
            ))}
          </Section>
        )}
        {posts.length > 0 && (
          <>
            <h2 className="srch-posts-title">Posts</h2>
            <div className="srch-posts">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </>
        )}
      </>
    );

  return (
    <>
      <div className="srch-bar">
        <div className="srch-bar-inner" role="tablist" aria-label="Filter results">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`srch-pill ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <main className="page srch-layout">
        <div className="srch-main">{body}</div>
        <aside className="srch-right">
          <RailFooter />
        </aside>
      </main>
    </>
  );
}
