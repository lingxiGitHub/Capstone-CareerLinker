import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApplyJobMutation, useCurrentUser, useGetJobsQuery, useSaveJobMutation } from "../../api";
import Avatar, { OrgLogo } from "../../components/Avatar";
import Button, { IconButton } from "../../components/Button";
import Icon from "../../components/Icon";
import { LogoMark } from "../../components/Logo";
import Modal from "../../components/Modal";
import { useToast } from "../../components/Toaster";
import { timeAgoLong } from "../../lib/time";
import useDocumentTitle from "../../lib/useDocumentTitle";
import "./JobsPage.css";

const WORKPLACES = ["Remote", "Hybrid", "On-site"];
const FRESH_MS = 3 * 86400000;

function useIsNarrow(px = 900) {
  const query = `(max-width: ${px}px)`;
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return narrow;
}

const applicants = (n) => (n === 0 ? "Be an early applicant" : `${n} applicant${n === 1 ? "" : "s"}`);

function useToggleSave() {
  const [saveJob] = useSaveJobMutation();
  const toast = useToast();
  return async (job) => {
    const res = await saveJob({ id: job.id, saved: !job.saved });
    if (res.error) toast(res.error.message, "error");
    else toast(job.saved ? "Job removed from saved jobs" : `Job saved: ${job.title} at ${job.company}`);
  };
}

// ---------------------------------------------------------------- search bar

function SearchBar({ params, setParams }) {
  const [q, setQ] = useState(params.get("q") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
    setLocation(params.get("location") ?? "");
  }, [params]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    next.delete("currentJobId");
    setParams(next);
  };

  const workplace = params.get("workplace");
  const view = params.get("view");
  const active = q || location || workplace || view || params.get("q") || params.get("location");

  return (
    <div className="card job-search">
      <form
        className="job-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: q.trim(), location: location.trim() });
        }}
        role="search"
      >
        <label className="job-search-field">
          <Icon name="search" size={20} />
          <input placeholder="Title, skill or company" aria-label="Search by title, skill or company" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="job-search-field">
          <Icon name="place" size={20} />
          <input placeholder="City, state, or zip code" aria-label="City, state, or zip code" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <Button type="submit" variant="primary" size="sm">
          Search
        </Button>
      </form>
      <div className="job-pills" aria-label="Filters">
        {WORKPLACES.map((w) => (
          <button
            key={w}
            type="button"
            aria-pressed={workplace === w}
            className={`job-pill ${workplace === w ? "active" : ""}`}
            onClick={() => update({ workplace: workplace === w ? null : w })}
          >
            {w}
          </button>
        ))}
        <span className="job-pill-sep" aria-hidden="true" />
        {[
          ["saved", "Saved jobs", "bookmark"],
          ["applied", "Applied", "check"],
        ].map(([key, label, icon]) => (
          <button
            key={key}
            type="button"
            aria-pressed={view === key}
            className={`job-pill ${view === key ? "active" : ""}`}
            onClick={() => update({ view: view === key ? null : key })}
          >
            <Icon name={icon} size={16} />
            {label}
          </button>
        ))}
        {active && (
          <button type="button" className="job-clear" onClick={() => setParams(new URLSearchParams())}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- list

function JobRow({ job, selected, onSelect }) {
  const toggleSave = useToggleSave();
  const fresh = Date.now() - new Date(job.created_at).getTime() < FRESH_MS;
  return (
    <li className={`job-row ${selected ? "selected" : ""}`}>
      <button type="button" className="job-row-main" onClick={onSelect} aria-current={selected ? "true" : undefined}>
        <OrgLogo name={job.company} size={56} />
        <span className="grow job-row-text">
          <span className="job-row-title">{job.title}</span>
          <span className="job-row-company">{job.company}</span>
          <span className="job-row-loc muted">
            {job.location} ({job.workplace_type})
          </span>
          {job.salary && <span className="small muted">{job.salary}</span>}
          <span className="job-row-meta small">
            {job.applied ? (
              <span className="job-applied-badge">
                <Icon name="check" size={14} /> Applied
              </span>
            ) : (
              <span className={fresh ? "job-fresh" : "muted"}>{timeAgoLong(job.created_at)}</span>
            )}
            <span className="muted">· {applicants(job.applicant_count)}</span>
            {job.easy_apply && !job.applied && (
              <span className="job-easy">
                <LogoMark size={14} /> Easy Apply
              </span>
            )}
          </span>
        </span>
      </button>
      <IconButton
        icon={job.saved ? "bookmarkFilled" : "bookmark"}
        label={job.saved ? `Unsave ${job.title}` : `Save ${job.title}`}
        size={20}
        className={`job-row-save ${job.saved ? "saved" : ""}`}
        onClick={() => toggleSave(job)}
      />
    </li>
  );
}

function JobListSkeleton() {
  return [0, 1, 2, 3, 4].map((i) => (
    <li key={i} className="job-row">
      <div className="job-row-main">
        <span className="skeleton" style={{ width: 56, height: 56 }} />
        <span className="grow stack" style={{ gap: 8 }}>
          <span className="skeleton" style={{ width: "70%", height: 14 }} />
          <span className="skeleton" style={{ width: "40%", height: 10 }} />
          <span className="skeleton" style={{ width: "55%", height: 10 }} />
        </span>
      </div>
    </li>
  ));
}

// ---------------------------------------------------------------- detail

function Description({ text }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="job-desc">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const bullets = lines.filter((l) => /^\s*[•\-*]\s+/.test(l));
        if (bullets.length && bullets.length === lines.length) {
          return (
            <ul key={i} className="job-desc-list">
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^\s*[•\-*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        if (bullets.length && !/^\s*[•\-*]/.test(lines[0])) {
          return (
            <div key={i}>
              <p className="bold">{lines[0]}</p>
              <ul className="job-desc-list">
                {lines.slice(1).map((l, j) => (
                  <li key={j}>{l.replace(/^\s*[•\-*]\s+/, "")}</li>
                ))}
              </ul>
            </div>
          );
        }
        return (
          <p key={i} className="job-desc-p">
            {block}
          </p>
        );
      })}
    </div>
  );
}

function JobDetail({ job, onBack, showBack }) {
  const [applying, setApplying] = useState(false);
  const toggleSave = useToggleSave();
  const toast = useToast();

  return (
    <article className="job-detail" aria-label={`${job.title} at ${job.company}`}>
      {showBack && (
        <div className="job-detail-back">
          <IconButton icon="back" label="Back to job list" onClick={onBack} />
        </div>
      )}
      <div className="job-detail-top">
        <div className="row">
          <OrgLogo name={job.company} size={32} />
          <span className="bold">{job.company}</span>
        </div>
        <h1 className="job-detail-title">{job.title}</h1>
        <p className="muted job-detail-meta">
          {job.location} · <span className={Date.now() - new Date(job.created_at) < FRESH_MS ? "job-fresh" : ""}>{timeAgoLong(job.created_at)}</span> ·{" "}
          {applicants(job.applicant_count)}
        </p>
        <ul className="job-facts">
          <li>
            <Icon name="jobs" size={20} />
            <span>
              <span className="job-chip">{job.workplace_type}</span>
              <span className="job-chip">{job.employment_type}</span>
              {job.seniority && <span className="muted">{job.seniority}</span>}
            </span>
          </li>
          {(job.company_size || job.industry) && (
            <li>
              <Icon name="company" size={20} />
              <span>{[job.company_size, job.industry].filter(Boolean).join(" · ")}</span>
            </li>
          )}
          {job.salary && (
            <li>
              <Icon name="trending" size={20} />
              <span>{job.salary}</span>
            </li>
          )}
          <li>
            <Icon name="lightbulb" size={20} />
            <span>See how you compare to {job.applicant_count + 3} others who clicked apply</span>
          </li>
        </ul>
        <div className="row job-actions">
          {job.applied ? (
            <span className="job-applied-state">
              <Icon name="check" size={20} /> Applied
              <span className="muted small"> · Application submitted</span>
            </span>
          ) : (
            <Button variant="primary" onClick={() => setApplying(true)}>
              {job.easy_apply && <LogoMark size={18} />} {job.easy_apply ? "Easy Apply" : "Apply"}
            </Button>
          )}
          <Button variant="secondary" icon={job.saved ? "bookmarkFilled" : "bookmark"} onClick={() => toggleSave(job)}>
            {job.saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <section className="job-section">
        <h2 className="job-section-title">About the job</h2>
        <Description text={job.description} />
      </section>

      <section className="job-section job-company">
        <h2 className="job-section-title">About the company</h2>
        <div className="row" style={{ gap: 12 }}>
          <OrgLogo name={job.company} size={56} />
          <div className="grow">
            <div className="bold" style={{ fontSize: 16 }}>
              {job.company}
            </div>
            <div className="small muted">{[job.industry, job.company_size].filter(Boolean).join(" · ")}</div>
          </div>
          <Button variant="secondary" size="sm" icon="add" onClick={() => toast(`You're now following ${job.company}`)}>
            Follow
          </Button>
        </div>
      </section>

      {applying && <EasyApplyModal job={job} onClose={() => setApplying(false)} />}
    </article>
  );
}

// ---------------------------------------------------------------- easy apply

const STEPS = ["Contact info", "Additional questions", "Review"];

function EasyApplyModal({ job, onClose }) {
  const me = useCurrentUser();
  const toast = useToast();
  const [applyJob, { isLoading }] = useApplyJobMutation();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setError(null);
    const res = await applyJob({ id: job.id, phone: phone.trim(), note: note.trim() });
    if (res.error) setError(res.error.message);
    else {
      setDone(true);
      toast(`Application sent to ${job.company}`);
    }
  };

  if (done) {
    return (
      <Modal title="Application sent" onClose={onClose} footer={<Button variant="primary" onClick={onClose}>Done</Button>}>
        <div className="job-apply-done">
          <span className="job-apply-check">
            <Icon name="check" size={32} />
          </span>
          <h3>Your application was sent to {job.company}!</h3>
          <p className="muted">You can keep track of your application in the “Applied” filter on Jobs.</p>
        </div>
      </Modal>
    );
  }

  const progress = Math.round(((step + 1) / STEPS.length) * 100);
  const footer = (
    <>
      {step > 0 && (
        <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
      )}
      {step < STEPS.length - 1 ? (
        <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
          Next
        </Button>
      ) : (
        <Button variant="primary" onClick={submit} disabled={isLoading}>
          {isLoading ? "Submitting…" : "Submit application"}
        </Button>
      )}
    </>
  );

  return (
    <Modal title={`Apply to ${job.company}`} onClose={onClose} footer={footer}>
      <div className="job-progress" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        <div className="job-progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <span className="small muted">{progress}%</span>
      </div>
      <h3 className="job-step-title">{STEPS[step]}</h3>
      {error && <div className="form-error">{error}</div>}

      {step === 0 && (
        <>
          <div className="row job-apply-me">
            <Avatar user={me} size={56} />
            <div className="grow">
              <div className="bold" style={{ fontSize: 16 }}>
                {me.first_name} {me.last_name}
              </div>
              {me.headline && <div className="small">{me.headline}</div>}
              {me.location && <div className="small muted">{me.location}</div>}
            </div>
          </div>
          <div className="field">
            <label htmlFor="apply-email">Email address</label>
            <input id="apply-email" className="input" value={me.email ?? ""} readOnly />
          </div>
          <div className="field">
            <label htmlFor="apply-phone">Mobile phone number</label>
            <input id="apply-phone" className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
          </div>
        </>
      )}

      {step === 1 && (
        <div className="field">
          <label htmlFor="apply-note">Why are you interested in this role?</label>
          <textarea id="apply-note" className="input" rows={6} value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} />
          <span className="small subtle" style={{ alignSelf: "flex-end" }}>
            {note.length}/2,000
          </span>
        </div>
      )}

      {step === 2 && (
        <dl className="job-review">
          <dt>Position</dt>
          <dd>
            {job.title} · {job.company}
          </dd>
          <dt>Name</dt>
          <dd>
            {me.first_name} {me.last_name}
          </dd>
          <dt>Email</dt>
          <dd>{me.email}</dd>
          <dt>Phone</dt>
          <dd>{phone.trim() || <span className="subtle">Not provided</span>}</dd>
          <dt>Why this role</dt>
          <dd className="job-review-note">{note.trim() || <span className="subtle">Not provided</span>}</dd>
        </dl>
      )}
    </Modal>
  );
}

// ---------------------------------------------------------------- page

export default function JobsPage() {
  useDocumentTitle("Jobs");
  const [params, setParams] = useSearchParams();
  const narrow = useIsNarrow();
  const filters = {};
  for (const key of ["q", "location", "workplace", "view"]) {
    const v = params.get(key);
    if (v) filters[key] = v;
  }
  const { data, isLoading, isFetching } = useGetJobsQuery(filters);
  const jobs = data?.jobs ?? [];
  const currentId = Number(params.get("currentJobId")) || null;
  const current = jobs.find((j) => j.id === currentId) ?? (narrow ? null : jobs[0]);
  const filtered = Object.keys(filters).length > 0;

  const select = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set("currentJobId", id);
    else next.delete("currentJobId");
    setParams(next, { replace: !narrow });
  };

  const heading =
    filters.view === "saved" ? "Saved jobs" : filters.view === "applied" ? "Applied jobs" : filtered ? "Search results" : "Top job picks for you";

  const showDetail = narrow && current;

  return (
    <main className="page job-page">
      <SearchBar params={params} setParams={setParams} />
      <div className={`card job-split ${showDetail ? "show-detail" : ""}`}>
        <section className="job-list" aria-label="Job results">
          <header className="job-list-head">
            <h2 className="job-list-title">{heading}</h2>
            <p className="small muted">
              {isLoading ? "Loading…" : `${jobs.length} result${jobs.length === 1 ? "" : "s"}`}
              {!filtered && !isLoading && " · Based on your profile and search history"}
            </p>
          </header>
          <ul className={`job-rows ${isFetching && !isLoading ? "refreshing" : ""}`}>
            {isLoading ? (
              <JobListSkeleton />
            ) : (
              jobs.map((job) => <JobRow key={job.id} job={job} selected={current?.id === job.id} onSelect={() => select(job.id)} />)
            )}
          </ul>
          {!isLoading && jobs.length === 0 && (
            <div className="job-empty">
              <Icon name="jobs" size={48} className="subtle" />
              <h3>No matching jobs found</h3>
              <p className="muted">
                {filters.view === "saved"
                  ? "Jobs you save will show up here."
                  : filters.view === "applied"
                    ? "Jobs you apply to will show up here."
                    : "Try different keywords or remove some filters."}
              </p>
              {filtered && (
                <Button variant="secondary" size="sm" onClick={() => setParams(new URLSearchParams())}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </section>
        <section className="job-detail-pane">
          {current ? (
            <JobDetail key={current.id} job={current} showBack={narrow} onBack={() => select(null)} />
          ) : isLoading ? (
            <div style={{ padding: 24 }} className="stack">
              <span className="skeleton" style={{ width: "30%", height: 14, marginBottom: 16 }} />
              <span className="skeleton" style={{ width: "70%", height: 24, marginBottom: 12 }} />
              <span className="skeleton" style={{ width: "50%", height: 12 }} />
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
