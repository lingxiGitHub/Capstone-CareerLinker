import { useState } from "react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Avatar from "../../components/Avatar";
import { useToast } from "../../components/Toaster";
import {
  useAddEducationMutation,
  useAddExperienceMutation,
  useAddSkillMutation,
  useUpdateMeMutation,
} from "../../api";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship"];

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <span className="field-error">
      <Icon name="error" size={16} /> {msg}
    </span>
  );
}

function Field({ id, label, required, error, children, hint }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      {children}
      {hint}
      <FieldError msg={error} />
    </div>
  );
}

function useForm(initial) {
  const [values, setValues] = useState(initial);
  const bind = (name) => ({
    id: `pf-${name}`,
    name,
    value: values[name] ?? "",
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });
  return [values, setValues, bind];
}

/** Everything PUT /users/me requires, so partial edits don't wipe other fields. */
function profilePayload(profile, overrides) {
  return {
    first_name: profile.first_name,
    last_name: profile.last_name,
    headline: profile.headline ?? "",
    location: profile.location ?? "",
    industry: profile.industry ?? "",
    about: profile.about ?? "",
    ...overrides,
  };
}

export function EditIntroModal({ profile, onClose }) {
  const [values, , bind] = useForm({
    first_name: profile.first_name,
    last_name: profile.last_name,
    headline: profile.headline ?? "",
    location: profile.location ?? "",
    industry: profile.industry ?? "",
    profile_photo: profile.profile_photo ?? "",
    banner_photo: profile.banner_photo ?? "",
  });
  const [update, { isLoading, error }] = useUpdateMeMutation();
  const toast = useToast();
  const errs = error?.errors ?? {};

  const save = async (e) => {
    e?.preventDefault();
    const res = await update(profilePayload(profile, values));
    if (!res.error) {
      toast("Profile updated");
      onClose();
    }
  };

  return (
    <Modal
      title="Edit intro"
      onClose={onClose}
      width={744}
      footer={
        <Button variant="primary" onClick={save} disabled={isLoading}>
          Save
        </Button>
      }
    >
      <form onSubmit={save}>
        <p className="small muted" style={{ marginBottom: 16 }}>
          * Indicates required
        </p>
        {error && !Object.keys(errs).length && <div className="form-error">{error.message}</div>}
        <div className="pf-form-grid">
          <Field id="pf-first_name" label="First name" required error={errs.first_name}>
            <input className={`input ${errs.first_name ? "invalid" : ""}`} {...bind("first_name")} required maxLength={40} />
          </Field>
          <Field id="pf-last_name" label="Last name" required error={errs.last_name}>
            <input className={`input ${errs.last_name ? "invalid" : ""}`} {...bind("last_name")} required maxLength={40} />
          </Field>
        </div>
        <Field
          id="pf-headline"
          label="Headline"
          error={errs.headline}
          hint={<span className="small muted pf-counter">{values.headline.length}/220</span>}
        >
          <textarea className="input" rows={2} style={{ minHeight: 56 }} maxLength={220} {...bind("headline")} />
        </Field>
        <div className="pf-form-grid">
          <Field id="pf-location" label="Location" error={errs.location}>
            <input className="input" placeholder="City, Country" {...bind("location")} />
          </Field>
          <Field id="pf-industry" label="Industry" error={errs.industry}>
            <input className="input" placeholder="e.g. Software Development" {...bind("industry")} />
          </Field>
        </div>
        <h3 className="pf-modal-section">Photos</h3>
        <Field id="pf-profile_photo" label="Profile photo URL" error={errs.profile_photo}>
          <div className="row">
            <Avatar user={{ ...profile, profile_photo: values.profile_photo }} size={48} key={values.profile_photo} />
            <input className="input grow" type="url" placeholder="https://…" {...bind("profile_photo")} />
          </div>
        </Field>
        <Field id="pf-banner_photo" label="Background photo URL" error={errs.banner_photo}>
          <div className="pf-banner-preview" style={values.banner_photo ? { backgroundImage: `url("${values.banner_photo}")` } : undefined} />
          <input className="input" type="url" placeholder="https://…" {...bind("banner_photo")} />
        </Field>
      </form>
    </Modal>
  );
}

export function AboutModal({ profile, onClose }) {
  const [about, setAbout] = useState(profile.about ?? "");
  const [update, { isLoading, error }] = useUpdateMeMutation();
  const toast = useToast();

  const save = async () => {
    const res = await update(profilePayload(profile, { about }));
    if (!res.error) {
      toast("Profile updated");
      onClose();
    }
  };

  return (
    <Modal
      title="Edit about"
      onClose={onClose}
      width={744}
      footer={
        <Button variant="primary" onClick={save} disabled={isLoading}>
          Save
        </Button>
      }
    >
      <p className="muted" style={{ marginBottom: 16 }}>
        You can write about your years of experience, industry, or skills. People also talk about their achievements or previous job experiences.
      </p>
      {error && <div className="form-error">{error.message}</div>}
      <textarea
        className="input"
        aria-label="About"
        rows={10}
        maxLength={2600}
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      />
      <div className="small muted pf-counter">{about.length}/2,600</div>
    </Modal>
  );
}

export function AddExperienceModal({ onClose }) {
  const [values, setValues, bind] = useForm({
    title: "",
    company: "",
    employment_type: "",
    location: "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const [current, setCurrent] = useState(true);
  const [add, { isLoading, error }] = useAddExperienceMutation();
  const toast = useToast();
  const errs = error?.errors ?? {};

  const save = async (e) => {
    e?.preventDefault();
    const res = await add({ ...values, end_date: current ? null : values.end_date || null });
    if (!res.error) {
      toast("Position added");
      onClose();
    }
  };

  return (
    <Modal
      title="Add experience"
      onClose={onClose}
      width={744}
      footer={
        <Button variant="primary" onClick={save} disabled={isLoading || !values.title.trim() || !values.company.trim() || !values.start_date}>
          Save
        </Button>
      }
    >
      <form onSubmit={save}>
        <p className="small muted" style={{ marginBottom: 16 }}>
          * Indicates required
        </p>
        {error && !Object.keys(errs).length && <div className="form-error">{error.message}</div>}
        <Field id="pf-title" label="Title" required error={errs.title}>
          <input className="input" placeholder="Ex: Retail Sales Manager" {...bind("title")} required />
        </Field>
        <Field id="pf-employment_type" label="Employment type" error={errs.employment_type}>
          <select className="input" {...bind("employment_type")}>
            <option value="">Please select</option>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field id="pf-company" label="Company name" required error={errs.company}>
          <input className="input" placeholder="Ex: Microsoft" {...bind("company")} required />
        </Field>
        <Field id="pf-location" label="Location" error={errs.location}>
          <input className="input" placeholder="Ex: London, United Kingdom" {...bind("location")} />
        </Field>
        <label className="pf-check">
          <input
            type="checkbox"
            checked={current}
            onChange={(e) => {
              setCurrent(e.target.checked);
              if (e.target.checked) setValues((v) => ({ ...v, end_date: "" }));
            }}
          />
          I am currently working in this role
        </label>
        <div className="pf-form-grid">
          <Field id="pf-start_date" label="Start date" required error={errs.start_date}>
            <input className="input" type="month" {...bind("start_date")} required />
          </Field>
          <Field id="pf-end_date" label="End date" error={errs.end_date}>
            {current ? (
              <input className="input" disabled value="Present" aria-label="End date" readOnly />
            ) : (
              <input className="input" type="month" {...bind("end_date")} />
            )}
          </Field>
        </div>
        <Field id="pf-description" label="Description" error={errs.description}>
          <textarea className="input" rows={4} maxLength={2000} {...bind("description")} />
        </Field>
      </form>
    </Modal>
  );
}

export function AddEducationModal({ onClose }) {
  const [values, , bind] = useForm({ school: "", degree: "", field: "", start_year: "", end_year: "" });
  const [add, { isLoading, error }] = useAddEducationMutation();
  const toast = useToast();
  const errs = error?.errors ?? {};
  const years = Array.from({ length: 70 }, (_, i) => new Date().getFullYear() + 7 - i);

  const save = async (e) => {
    e?.preventDefault();
    const res = await add(values);
    if (!res.error) {
      toast("Education added");
      onClose();
    }
  };

  return (
    <Modal
      title="Add education"
      onClose={onClose}
      width={744}
      footer={
        <Button variant="primary" onClick={save} disabled={isLoading || !values.school.trim()}>
          Save
        </Button>
      }
    >
      <form onSubmit={save}>
        <p className="small muted" style={{ marginBottom: 16 }}>
          * Indicates required
        </p>
        {error && !Object.keys(errs).length && <div className="form-error">{error.message}</div>}
        <Field id="pf-school" label="School" required error={errs.school}>
          <input className="input" placeholder="Ex: Boston University" {...bind("school")} required />
        </Field>
        <Field id="pf-degree" label="Degree" error={errs.degree}>
          <input className="input" placeholder="Ex: Bachelor's" {...bind("degree")} />
        </Field>
        <Field id="pf-field" label="Field of study" error={errs.field}>
          <input className="input" placeholder="Ex: Business" {...bind("field")} />
        </Field>
        <div className="pf-form-grid">
          <Field id="pf-start_year" label="Start year" error={errs.start_year}>
            <select className="input" {...bind("start_year")}>
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </Field>
          <Field id="pf-end_year" label="End year (or expected)" error={errs.end_year}>
            <select className="input" {...bind("end_year")}>
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </Field>
        </div>
      </form>
    </Modal>
  );
}

export function AddSkillModal({ onClose }) {
  const [name, setName] = useState("");
  const [add, { isLoading, error, reset }] = useAddSkillMutation();
  const toast = useToast();

  const save = async (e) => {
    e?.preventDefault();
    if (!name.trim()) return;
    const res = await add(name.trim());
    if (!res.error) {
      toast(`${name.trim()} added to skills`);
      onClose();
    }
  };

  return (
    <Modal
      title="Add skill"
      onClose={onClose}
      footer={
        <Button variant="primary" onClick={save} disabled={isLoading || !name.trim()}>
          Save
        </Button>
      }
    >
      <form onSubmit={save}>
        <Field id="pf-skill" label="Skill" required error={error?.errors?.name || error?.message}>
          <input
            id="pf-skill"
            className={`input ${error ? "invalid" : ""}`}
            placeholder="Skill (ex: Project Management)"
            maxLength={60}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) reset();
            }}
          />
        </Field>
      </form>
    </Modal>
  );
}

export function ContactModal({ profile, isOwn, onClose }) {
  const slug = `${profile.first_name}-${profile.last_name}-${profile.id}`.toLowerCase();
  return (
    <Modal title={`${profile.first_name} ${profile.last_name}`} onClose={onClose} width={500}>
      <h3 className="pf-modal-section" style={{ marginTop: 0 }}>
        Contact Info
      </h3>
      <div className="pf-contact-row">
        <Icon name="person" />
        <div>
          <div className="bold">Your Profile</div>
          <span className="link">careerlinker.com/in/{slug}</span>
        </div>
      </div>
      {isOwn ? (
        <div className="pf-contact-row">
          <Icon name="messaging" />
          <div>
            <div className="bold">Email</div>
            <span className="link">{profile.email ?? "Only visible to you in settings"}</span>
          </div>
        </div>
      ) : (
        <p className="muted" style={{ marginTop: 8 }}>
          Message {profile.first_name} to get in touch.
        </p>
      )}
    </Modal>
  );
}
