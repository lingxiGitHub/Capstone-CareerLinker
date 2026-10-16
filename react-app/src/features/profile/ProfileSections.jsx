import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useDeleteEducationMutation,
  useDeleteExperienceMutation,
  useDeleteSkillMutation,
  useGetUserPostsQuery,
} from "../../api";
import { OrgLogo } from "../../components/Avatar";
import Button, { IconButton } from "../../components/Button";
import Icon from "../../components/Icon";
import { useToast } from "../../components/Toaster";
import { REACTION_BY_TYPE } from "../../lib/reactions";
import { duration, monthYear, timeAgo } from "../../lib/time";
import SeeMore from "./SeeMore";

function SectionHeader({ title, subtitle, actions }) {
  return (
    <div className="pf-section-head">
      <div className="grow">
        <h2 className="card-title">{title}</h2>
        {subtitle && <div className="small muted">{subtitle}</div>}
      </div>
      {actions && <div className="row" style={{ gap: 4 }}>{actions}</div>}
    </div>
  );
}

function useConfirmDelete(mutation, noun) {
  const toast = useToast();
  return async (id, label) => {
    if (!window.confirm(`Delete ${label}?`)) return;
    const res = await mutation(id);
    toast(res.error ? res.error.message : `${noun} deleted`, res.error ? "error" : "success");
  };
}

export function AboutSection({ profile, isOwn, onEdit }) {
  if (!profile.about && !isOwn) return null;
  return (
    <section className="card pf-section">
      <SectionHeader title="About" actions={isOwn && <IconButton icon="edit" label="Edit about" onClick={onEdit} />} />
      {profile.about ? (
        <SeeMore text={profile.about} lines={3} />
      ) : (
        <p className="muted">
          Write a summary to highlight your personality or work experience.{" "}
          <button type="button" className="link" onClick={onEdit}>
            Add a summary
          </button>
        </p>
      )}
    </section>
  );
}

export function ActivitySection({ profile, isOwn }) {
  const [limit, setLimit] = useState(3);
  const navigate = useNavigate();
  const { data, isLoading } = useGetUserPostsQuery({ id: profile.id, limit });
  const posts = data?.posts ?? [];
  const name = `${profile.first_name} ${profile.last_name}`;

  return (
    <section className="card pf-section pf-activity">
      <SectionHeader
        title="Activity"
        subtitle={<span className="link">{profile.connection_count.toLocaleString()} followers</span>}
        actions={
          isOwn && (
            <Button variant="secondary" size="sm" onClick={() => navigate("/feed")}>
              Create a post
            </Button>
          )
        }
      />
      {isLoading ? (
        <div className="skeleton" style={{ height: 64 }} />
      ) : posts.length === 0 ? (
        <p className="muted">
          {isOwn ? "You haven't posted yet" : `${profile.first_name} hasn't posted yet`}
          <br />
          <span className="small">Recent posts {isOwn ? "you share" : "they share"} will be displayed here.</span>
        </p>
      ) : (
        <ul className="pf-activity-list">
          {posts.map((post) => (
            <li key={post.id} className="pf-activity-item">
              <div className="small muted">
                <span className="bold" style={{ color: "var(--text)" }}>{name}</span> posted this • {timeAgo(post.created_at)}
              </div>
              <div className="pf-activity-body">
                {post.image_url && <img src={post.image_url} alt="" className="pf-activity-thumb" loading="lazy" />}
                <p className="clamp-2 grow" style={{ whiteSpace: "pre-line" }}>
                  {post.content}
                </p>
              </div>
              <div className="row small muted pf-activity-stats">
                {post.reaction_count > 0 && (
                  <span className="row" style={{ gap: 4 }}>
                    <span className="pf-reaction-stack">
                      {post.top_reactions.map((t) => (
                        <span key={t} className="pf-reaction-dot" style={{ background: REACTION_BY_TYPE[t]?.color }}>
                          {REACTION_BY_TYPE[t]?.emoji}
                        </span>
                      ))}
                    </span>
                    {post.reaction_count}
                  </span>
                )}
                {post.comment_count > 0 && (
                  <span style={{ marginLeft: "auto" }}>
                    {post.comment_count} comment{post.comment_count === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {(data?.has_more || limit > 3) && (
        <button type="button" className="show-all" onClick={() => setLimit((l) => (l > 3 ? 3 : 20))}>
          {limit > 3 ? "Show less" : "Show all posts"} <Icon name={limit > 3 ? "back" : "forward"} size={16} />
        </button>
      )}
    </section>
  );
}

export function ExperienceSection({ profile, isOwn, onAdd }) {
  const [del] = useDeleteExperienceMutation();
  const confirmDelete = useConfirmDelete(del, "Position");
  if (!profile.experiences.length && !isOwn) return null;

  return (
    <section className="card pf-section">
      <SectionHeader title="Experience" actions={isOwn && <IconButton icon="add" label="Add position" onClick={onAdd} />} />
      {profile.experiences.length === 0 ? (
        <EmptyPrompt icon="jobs" text="Showcase your accomplishments and get up to 2X as many profile views and connections." cta="Add experience" onClick={onAdd} />
      ) : (
        <ul>
          {profile.experiences.map((e) => (
            <li key={e.id} className="pf-entry">
              <OrgLogo name={e.company} size={48} />
              <div className="grow pf-entry-body">
                <div className="bold pf-entry-title">{e.title}</div>
                <div>
                  {e.company}
                  {e.employment_type && ` · ${e.employment_type}`}
                </div>
                <div className="small muted">
                  {monthYear(e.start_date)} - {monthYear(e.end_date)} · {duration(e.start_date, e.end_date)}
                </div>
                {e.location && <div className="small muted">{e.location}</div>}
                {e.description && <SeeMore text={e.description} lines={2} className="pf-entry-desc" />}
              </div>
              {isOwn && (
                <IconButton icon="trash" label={`Delete ${e.title} at ${e.company}`} className="pf-entry-delete" onClick={() => confirmDelete(e.id, `${e.title} at ${e.company}`)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function EducationSection({ profile, isOwn, onAdd }) {
  const [del] = useDeleteEducationMutation();
  const confirmDelete = useConfirmDelete(del, "Education");
  if (!profile.educations.length && !isOwn) return null;

  return (
    <section className="card pf-section">
      <SectionHeader title="Education" actions={isOwn && <IconButton icon="add" label="Add education" onClick={onAdd} />} />
      {profile.educations.length === 0 ? (
        <EmptyPrompt icon="school" text="Show your qualifications and be up to 2X more likely to receive a recruiter InMail." cta="Add education" onClick={onAdd} />
      ) : (
        <ul>
          {profile.educations.map((e) => (
            <li key={e.id} className="pf-entry">
              <OrgLogo name={e.school} size={48} kind="school" />
              <div className="grow pf-entry-body">
                <div className="bold pf-entry-title">{e.school}</div>
                {(e.degree || e.field) && <div>{[e.degree, e.field].filter(Boolean).join(", ")}</div>}
                {(e.start_year || e.end_year) && (
                  <div className="small muted">{[e.start_year, e.end_year].filter(Boolean).join(" - ")}</div>
                )}
              </div>
              {isOwn && (
                <IconButton icon="trash" label={`Delete ${e.school}`} className="pf-entry-delete" onClick={() => confirmDelete(e.id, e.school)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function SkillsSection({ profile, isOwn, onAdd }) {
  const [del] = useDeleteSkillMutation();
  const confirmDelete = useConfirmDelete(del, "Skill");
  if (!profile.skills.length && !isOwn) return null;

  return (
    <section className="card pf-section">
      <SectionHeader title="Skills" actions={isOwn && <IconButton icon="add" label="Add skill" onClick={onAdd} />} />
      {profile.skills.length === 0 ? (
        <EmptyPrompt icon="lightbulb" text="Showcase your skills to help recruiters find you." cta="Add skill" onClick={onAdd} />
      ) : (
        <ul className="pf-skills">
          {profile.skills.map((s) => (
            <li key={s.id} className="pf-skill">
              <span className="bold grow">{s.name}</span>
              {isOwn && (
                <IconButton icon="trash" size={20} label={`Delete ${s.name}`} className="pf-entry-delete" onClick={() => confirmDelete(s.id, s.name)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EmptyPrompt({ icon, text, cta, onClick }) {
  return (
    <div className="pf-empty">
      <Icon name={icon} size={32} className="muted" />
      <p className="muted grow">{text}</p>
      <Button variant="muted" size="sm" onClick={onClick}>
        {cta}
      </Button>
    </div>
  );
}

export function AnalyticsSection({ profile }) {
  const stats = [
    { icon: "person", value: 12 + profile.connection_count * 3, label: "profile views", hint: "Discover who's viewed your profile." },
    { icon: "trending", value: profile.post_count * 137, label: "post impressions", hint: "Check out who's engaging with your posts." },
    { icon: "search", value: 8 + profile.connection_count * 2, label: "search appearances", hint: "See how often you appear in search results." },
  ];
  return (
    <section className="card pf-section">
      <SectionHeader
        title="Analytics"
        subtitle={
          <span className="row" style={{ gap: 4 }}>
            <Icon name="eye" size={16} /> Private to you
          </span>
        }
      />
      <ul className="pf-analytics">
        {stats.map((s) => (
          <li key={s.label} className="pf-analytic">
            <Icon name={s.icon} />
            <div>
              <div className="bold">
                {s.value.toLocaleString()} {s.label}
              </div>
              <div className="small muted">{s.hint}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PublicUrlCard({ profile }) {
  const slug = `${profile.first_name}-${profile.last_name}-${profile.id}`.toLowerCase();
  return (
    <section className="card pf-aside-card">
      <div className="pf-aside-row">
        <div className="grow">
          <div className="bold">Profile language</div>
          <div className="small muted">English</div>
        </div>
        <Icon name="edit" size={20} className="muted" />
      </div>
      <hr className="divider" />
      <div className="pf-aside-row">
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="bold">Public profile &amp; URL</div>
          <div className="small muted truncate">careerlinker.com/in/{slug}</div>
        </div>
        <Icon name="edit" size={20} className="muted" />
      </div>
    </section>
  );
}

export function PeopleYouMayKnow({ people }) {
  if (!people?.length) return null;
  return (
    <section className="card pf-aside-card">
      <h2 className="pf-aside-title">People you may know</h2>
      <ul>
        {people.map(({ AvatarEl, person, action }) => (
          <li key={person.id} className="pf-pymk">
            {AvatarEl}
            <div className="grow" style={{ minWidth: 0 }}>
              <Link to={`/in/${person.id}`} className="bold hover-underline">
                {person.first_name} {person.last_name}
              </Link>
              <div className="small muted clamp-2">{person.headline}</div>
              <div style={{ marginTop: 8 }}>{action}</div>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/mynetwork" className="show-all">
        Show all
      </Link>
    </section>
  );
}
