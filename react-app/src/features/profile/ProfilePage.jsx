import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCurrentUser,
  useGetProfileQuery,
  useGetSuggestionsQuery,
  useRemoveConnectionMutation,
} from "../../api";
import Avatar, { OrgLogo } from "../../components/Avatar";
import Button, { IconButton } from "../../components/Button";
import ConnectButton from "../../components/ConnectButton";
import Icon from "../../components/Icon";
import Menu from "../../components/Menu";
import RailFooter from "../../components/RailFooter";
import { useToast } from "../../components/Toaster";
import useDocumentTitle from "../../lib/useDocumentTitle";
import {
  AboutModal,
  AddEducationModal,
  AddExperienceModal,
  AddSkillModal,
  ContactModal,
  EditIntroModal,
} from "./ProfileModals";
import {
  AboutSection,
  ActivitySection,
  AnalyticsSection,
  EducationSection,
  ExperienceSection,
  PeopleYouMayKnow,
  PublicUrlCard,
  SkillsSection,
} from "./ProfileSections";
import "./Profile.css";

function ProfileSkeleton() {
  return (
    <section className="card pf-intro" aria-busy="true" aria-label="Loading profile">
      <div className="pf-banner skeleton" style={{ borderRadius: 0 }} />
      <div className="pf-intro-body">
        <div className="pf-avatar-wrap">
          <div className="skeleton" style={{ width: 152, height: 152, borderRadius: "50%", border: "4px solid #fff" }} />
        </div>
        <div className="skeleton" style={{ width: 240, height: 24, marginTop: 56 }} />
        <div className="skeleton" style={{ width: 360, maxWidth: "100%", height: 16, marginTop: 12 }} />
        <div className="skeleton" style={{ width: 180, height: 14, marginTop: 12 }} />
      </div>
    </section>
  );
}

function Unavailable() {
  return (
    <section className="card card-pad pf-unavailable">
      <Icon name="person" size={64} className="subtle" />
      <h1>This profile is unavailable</h1>
      <p className="muted">The member may have deleted their account, or the link may be incorrect.</p>
      <Button variant="secondary" to="/feed">
        Go to your feed
      </Button>
    </section>
  );
}

function IntroCard({ profile, isOwn, onOpen }) {
  const [removeConnection] = useRemoveConnectionMutation();
  const toast = useToast();
  const navigate = useNavigate();
  const name = `${profile.first_name} ${profile.last_name}`;
  const connected = profile.connection_status === "connected";

  const moreItems = isOwn
    ? [
        { icon: "edit", label: "Edit intro", onClick: () => onOpen("intro") },
        { icon: "info", label: "Contact info", onClick: () => onOpen("contact") },
      ]
    : [
        { icon: "info", label: "Contact info", onClick: () => onOpen("contact") },
        ...(connected
          ? [
              {
                icon: "personRemove",
                label: "Remove connection",
                danger: true,
                onClick: async () => {
                  if (!window.confirm(`Remove ${name} from your connections?`)) return;
                  const res = await removeConnection(profile.id);
                  toast(res.error ? res.error.message : `${name} was removed from your connections`, res.error ? "error" : "success");
                },
              },
            ]
          : []),
      ];

  return (
    <section className="card pf-intro">
      <div
        className="pf-banner"
        style={profile.banner_photo ? { backgroundImage: `url("${profile.banner_photo}")` } : undefined}
        role="img"
        aria-label={`${name}'s background photo`}
      />
      <div className="pf-intro-body">
        <div className="pf-avatar-wrap">
          <Avatar user={profile} size={152} ring />
        </div>
        {isOwn && <IconButton icon="edit" label="Edit intro" className="pf-edit-intro" onClick={() => onOpen("intro")} />}

        <div className="pf-intro-grid">
          <div className="pf-intro-main">
            <h1 className="pf-name">{name}</h1>
            {profile.headline && <p className="pf-headline">{profile.headline}</p>}
            <p className="pf-meta">
              {profile.location && <span className="muted">{profile.location}</span>}
              {profile.location && <span className="muted"> · </span>}
              <button type="button" className="link" onClick={() => onOpen("contact")}>
                Contact info
              </button>
            </p>
            <p className="pf-meta">
              {isOwn ? (
                <Link to="/mynetwork/connections" className="link">
                  {profile.connection_count > 500 ? "500+" : profile.connection_count} connections
                </Link>
              ) : (
                <>
                  <span className="link">{profile.connection_count > 500 ? "500+" : profile.connection_count} connections</span>
                  {profile.mutual_count > 0 && (
                    <span className="muted">
                      {" "}
                      · {profile.mutual_count} mutual connection{profile.mutual_count === 1 ? "" : "s"}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          {(profile.current_company || profile.school) && (
            <ul className="pf-orgs">
              {profile.current_company && (
                <li>
                  <OrgLogo name={profile.current_company} size={32} />
                  <span className="bold clamp-2">{profile.current_company}</span>
                </li>
              )}
              {profile.school && (
                <li>
                  <OrgLogo name={profile.school} size={32} kind="school" />
                  <span className="bold clamp-2">{profile.school}</span>
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="pf-actions">
          {isOwn ? (
            <>
              <Button variant="primary" size="sm" onClick={() => navigate("/jobs")}>
                Open to
              </Button>
              <Menu
                align="left"
                label="Add profile section"
                trigger={<span className="btn btn-secondary btn-sm">Add profile section</span>}
                items={[
                  { icon: "jobs", label: "Add position", onClick: () => onOpen("experience") },
                  { icon: "school", label: "Add education", onClick: () => onOpen("education") },
                  { icon: "lightbulb", label: "Add skills", onClick: () => onOpen("skill") },
                  { icon: "article", label: "Add about", onClick: () => onOpen("about") },
                ]}
              />
            </>
          ) : (
            <>
              {connected ? (
                <Button variant="primary" size="sm" icon="send" onClick={() => navigate(`/messaging?to=${profile.id}`)}>
                  Message
                </Button>
              ) : (
                <>
                  <ConnectButton user={profile} status={profile.connection_status} size="sm" />
                  <Button variant="secondary" size="sm" icon="send" onClick={() => navigate(`/messaging?to=${profile.id}`)}>
                    Message
                  </Button>
                </>
              )}
            </>
          )}
          <Menu align="left" label="More actions" trigger={<span className="btn btn-muted btn-sm">More</span>} items={moreItems} />
        </div>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const { userId } = useParams();
  const id = Number(userId);
  const me = useCurrentUser();
  const { data: profile, isLoading, isFetching, error } = useGetProfileQuery(id, { skip: !Number.isInteger(id) });
  const { data: suggestions } = useGetSuggestionsQuery(5);
  const [modal, setModal] = useState(null);
  const isOwn = me?.id === id;
  const close = () => setModal(null);

  useDocumentTitle(profile ? `${profile.first_name} ${profile.last_name}` : isLoading ? "Profile" : "Profile unavailable");

  const unavailable = !Number.isInteger(id) || error?.status === 404 || (error && !profile);
  const showSkeleton = isLoading || (isFetching && profile?.id !== id);
  // to_profile() hides email; on your own profile the session user has it.
  const fullProfile = profile && isOwn ? { ...profile, email: me.email } : profile;

  const pymk = (suggestions?.people ?? [])
    .filter((p) => p.id !== id)
    .slice(0, 5)
    .map((person) => ({
      person,
      AvatarEl: (
        <Link to={`/in/${person.id}`} aria-label={`${person.first_name} ${person.last_name}`}>
          <Avatar user={person} size={48} />
        </Link>
      ),
      action: <ConnectButton user={person} status="none" size="sm" />,
    }));

  return (
    <main className="page pf-layout">
      <div className="pf-main">
        {unavailable ? (
          <Unavailable />
        ) : showSkeleton || !fullProfile ? (
          <ProfileSkeleton />
        ) : (
          <>
            <IntroCard profile={fullProfile} isOwn={isOwn} onOpen={setModal} />
            {isOwn && <AnalyticsSection profile={fullProfile} />}
            <AboutSection profile={fullProfile} isOwn={isOwn} onEdit={() => setModal("about")} />
            <ActivitySection profile={fullProfile} isOwn={isOwn} />
            <ExperienceSection profile={fullProfile} isOwn={isOwn} onAdd={() => setModal("experience")} />
            <EducationSection profile={fullProfile} isOwn={isOwn} onAdd={() => setModal("education")} />
            <SkillsSection profile={fullProfile} isOwn={isOwn} onAdd={() => setModal("skill")} />
          </>
        )}
      </div>

      <aside className="pf-aside">
        {fullProfile && isOwn && <PublicUrlCard profile={fullProfile} />}
        <PeopleYouMayKnow people={pymk} />
        <RailFooter />
      </aside>

      {fullProfile && modal === "intro" && <EditIntroModal profile={fullProfile} onClose={close} />}
      {fullProfile && modal === "about" && <AboutModal profile={fullProfile} onClose={close} />}
      {fullProfile && modal === "contact" && <ContactModal profile={fullProfile} isOwn={isOwn} onClose={close} />}
      {modal === "experience" && <AddExperienceModal onClose={close} />}
      {modal === "education" && <AddEducationModal onClose={close} />}
      {modal === "skill" && <AddSkillModal onClose={close} />}
    </main>
  );
}
