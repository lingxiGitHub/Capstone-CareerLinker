from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from .db import add_prefix_for_prod, db, iso, table_args, utcnow


class User(db.Model, UserMixin):
    __tablename__ = "users"
    __table_args__ = table_args()

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(40), nullable=False)
    last_name = db.Column(db.String(40), nullable=False)
    headline = db.Column(db.String(220))
    about = db.Column(db.Text)
    location = db.Column(db.String(100))
    industry = db.Column(db.String(100))
    profile_photo = db.Column(db.String(500))
    banner_photo = db.Column(db.String(500))
    notifications_seen_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    posts = db.relationship("Post", back_populates="author", cascade="all, delete-orphan")
    experiences = db.relationship(
        "Experience",
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="desc(Experience.start_date)",
    )
    educations = db.relationship(
        "Education",
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="desc(Education.end_year)",
    )
    skills = db.relationship("Skill", back_populates="user", cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def to_summary(self):
        """The compact shape used anywhere a person is shown (posts, lists, chat)."""
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "headline": self.headline,
            "profile_photo": self.profile_photo,
        }

    def to_dict(self):
        return {
            **self.to_summary(),
            "email": self.email,
            "about": self.about,
            "location": self.location,
            "industry": self.industry,
            "banner_photo": self.banner_photo,
            "created_at": iso(self.created_at),
        }

    def to_profile(self):
        data = self.to_dict()
        data.pop("email")
        current = self.experiences[0] if self.experiences else None
        return {
            **data,
            "current_company": current.company if current and not current.end_date else None,
            "school": self.educations[0].school if self.educations else None,
            "experiences": [e.to_dict() for e in self.experiences],
            "educations": [e.to_dict() for e in self.educations],
            "skills": [s.to_dict() for s in self.skills],
        }


class Experience(db.Model):
    __tablename__ = "experiences"
    __table_args__ = table_args()

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    employment_type = db.Column(db.String(40))
    location = db.Column(db.String(100))
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    description = db.Column(db.Text)

    user = db.relationship("User", back_populates="experiences")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "employment_type": self.employment_type,
            "location": self.location,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "description": self.description,
        }


class Education(db.Model):
    __tablename__ = "educations"
    __table_args__ = table_args()

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    school = db.Column(db.String(120), nullable=False)
    degree = db.Column(db.String(120))
    field = db.Column(db.String(120))
    start_year = db.Column(db.Integer)
    end_year = db.Column(db.Integer)

    user = db.relationship("User", back_populates="educations")

    def to_dict(self):
        return {
            "id": self.id,
            "school": self.school,
            "degree": self.degree,
            "field": self.field,
            "start_year": self.start_year,
            "end_year": self.end_year,
        }


class Skill(db.Model):
    __tablename__ = "skills"
    __table_args__ = table_args(db.UniqueConstraint("user_id", "name"))

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(60), nullable=False)

    user = db.relationship("User", back_populates="skills")

    def to_dict(self):
        return {"id": self.id, "name": self.name}
