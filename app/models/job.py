from .db import add_prefix_for_prod, db, iso, table_args, utcnow


class Job(db.Model):
    __tablename__ = "jobs"
    __table_args__ = table_args()

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    company_size = db.Column(db.String(40))
    industry = db.Column(db.String(100))
    location = db.Column(db.String(100), nullable=False)
    workplace_type = db.Column(db.String(20), nullable=False, default="On-site")
    employment_type = db.Column(db.String(20), nullable=False, default="Full-time")
    seniority = db.Column(db.String(40))
    salary = db.Column(db.String(60))
    description = db.Column(db.Text, nullable=False)
    easy_apply = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    applications = db.relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")

    def to_dict(self, saved_ids=frozenset(), applied_ids=frozenset()):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "company_size": self.company_size,
            "industry": self.industry,
            "location": self.location,
            "workplace_type": self.workplace_type,
            "employment_type": self.employment_type,
            "seniority": self.seniority,
            "salary": self.salary,
            "description": self.description,
            "easy_apply": self.easy_apply,
            "applicant_count": len(self.applications),
            "created_at": iso(self.created_at),
            "saved": self.id in saved_ids,
            "applied": self.id in applied_ids,
        }


class SavedJob(db.Model):
    __tablename__ = "saved_jobs"
    __table_args__ = table_args()

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("jobs.id")), primary_key=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)


class JobApplication(db.Model):
    __tablename__ = "job_applications"
    __table_args__ = table_args(db.UniqueConstraint("user_id", "job_id"))

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("jobs.id")), nullable=False)
    phone = db.Column(db.String(30))
    note = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    job = db.relationship("Job", back_populates="applications")

    def to_dict(self):
        return {"id": self.id, "job_id": self.job_id, "created_at": iso(self.created_at)}
