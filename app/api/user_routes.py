from datetime import date

from flask import Blueprint, request
from flask_login import current_user, login_required

from app.models import (
    Connection,
    Conversation,
    ConversationParticipant,
    Education,
    Experience,
    Post,
    Skill,
    User,
    db,
)

from .notification_routes import unseen_notification_count
from .utils import ApiError, body, forbid_unless, get_or_404, optional_text, pagination, require_text

user_routes = Blueprint("users", __name__)


def mutual_count(a_ids, user_id):
    return len(a_ids & Connection.connected_ids(user_id))


@user_routes.route("/<int:user_id>")
@login_required
def profile(user_id):
    user = get_or_404(User, user_id, "Profile")
    mine = Connection.connected_ids(current_user.id)
    return {
        **user.to_profile(),
        "connection_count": len(Connection.connected_ids(user.id)),
        "connection_status": Connection.status_for(current_user.id, user.id),
        "mutual_count": mutual_count(mine, user.id) if user.id != current_user.id else 0,
        "post_count": Post.query.filter_by(user_id=user.id).count(),
    }


@user_routes.route("/<int:user_id>/posts")
@login_required
def user_posts(user_id):
    get_or_404(User, user_id, "Profile")
    offset, limit = pagination()
    posts = (
        Post.query.filter_by(user_id=user_id)
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit + 1)
        .all()
    )
    connected = Connection.connected_ids(current_user.id)
    return {
        "posts": [p.to_dict(current_user.id, connected) for p in posts[:limit]],
        "has_more": len(posts) > limit,
    }


@user_routes.route("/me", methods=["PUT"])
@login_required
def update_me():
    data = body()
    user = current_user
    user.first_name = require_text(data, "first_name", "First name", 40)
    user.last_name = require_text(data, "last_name", "Last name", 40)
    user.headline = optional_text(data, "headline", 220)
    user.location = optional_text(data, "location", 100)
    user.industry = optional_text(data, "industry", 100)
    user.about = optional_text(data, "about", 2600)
    if "profile_photo" in data:
        user.profile_photo = optional_text(data, "profile_photo", 500)
    if "banner_photo" in data:
        user.banner_photo = optional_text(data, "banner_photo", 500)
    db.session.commit()
    return {"user": user.to_dict()}


def parse_month(value, field, required=True):
    if not value:
        if required:
            raise ApiError("Start date is required", errors={field: "Required"})
        return None
    try:
        year, month = (int(p) for p in value.split("-")[:2])
        return date(year, month, 1)
    except (ValueError, TypeError):
        raise ApiError("Dates must look like YYYY-MM", errors={field: "Invalid date"})


@user_routes.route("/me/experiences", methods=["POST"])
@login_required
def add_experience():
    data = body()
    start = parse_month(data.get("start_date"), "start_date")
    end = parse_month(data.get("end_date"), "end_date", required=False)
    if end and end < start:
        raise ApiError("End date can't be before start date", errors={"end_date": "Must be after start date"})
    exp = Experience(
        user_id=current_user.id,
        title=require_text(data, "title", "Title", 100),
        company=require_text(data, "company", "Company", 100),
        employment_type=optional_text(data, "employment_type", 40),
        location=optional_text(data, "location", 100),
        start_date=start,
        end_date=end,
        description=optional_text(data, "description", 2000),
    )
    db.session.add(exp)
    db.session.commit()
    return exp.to_dict(), 201


@user_routes.route("/me/experiences/<int:exp_id>", methods=["DELETE"])
@login_required
def delete_experience(exp_id):
    exp = get_or_404(Experience, exp_id, "Experience")
    forbid_unless(exp.user_id == current_user.id)
    db.session.delete(exp)
    db.session.commit()
    return {"id": exp_id}


@user_routes.route("/me/educations", methods=["POST"])
@login_required
def add_education():
    data = body()

    def year(field):
        raw = data.get(field)
        if raw in (None, ""):
            return None
        try:
            return int(raw)
        except ValueError:
            raise ApiError("Years must be numbers", errors={field: "Invalid year"})

    edu = Education(
        user_id=current_user.id,
        school=require_text(data, "school", "School", 120),
        degree=optional_text(data, "degree", 120),
        field=optional_text(data, "field", 120),
        start_year=year("start_year"),
        end_year=year("end_year"),
    )
    db.session.add(edu)
    db.session.commit()
    return edu.to_dict(), 201


@user_routes.route("/me/educations/<int:edu_id>", methods=["DELETE"])
@login_required
def delete_education(edu_id):
    edu = get_or_404(Education, edu_id, "Education")
    forbid_unless(edu.user_id == current_user.id)
    db.session.delete(edu)
    db.session.commit()
    return {"id": edu_id}


@user_routes.route("/me/skills", methods=["POST"])
@login_required
def add_skill():
    name = require_text(body(), "name", "Skill", 60)
    if Skill.query.filter(Skill.user_id == current_user.id, db.func.lower(Skill.name) == name.lower()).first():
        raise ApiError("You've already added this skill", errors={"name": "Already added"})
    skill = Skill(user_id=current_user.id, name=name)
    db.session.add(skill)
    db.session.commit()
    return skill.to_dict(), 201


@user_routes.route("/me/skills/<int:skill_id>", methods=["DELETE"])
@login_required
def delete_skill(skill_id):
    skill = get_or_404(Skill, skill_id, "Skill")
    forbid_unless(skill.user_id == current_user.id)
    db.session.delete(skill)
    db.session.commit()
    return {"id": skill_id}


@user_routes.route("/me/badges")
@login_required
def badges():
    """Unread counts shown on the global nav icons."""
    pending = Connection.query.filter_by(addressee_id=current_user.id, status="pending").count()
    conversations = (
        Conversation.query.join(ConversationParticipant)
        .filter(ConversationParticipant.user_id == current_user.id)
        .all()
    )
    return {
        "network": pending,
        "messaging": sum(1 for c in conversations if c.is_unread_for(current_user.id)),
        "notifications": unseen_notification_count(current_user),
    }


@user_routes.route("/suggestions")
@login_required
def suggestions():
    """People you may know: not yet connected, ranked by mutual connections."""
    limit = min(int(request.args.get("limit", 12)), 50)
    mine = Connection.connected_ids(current_user.id)
    related = Connection.query.filter(
        db.or_(Connection.requester_id == current_user.id, Connection.addressee_id == current_user.id)
    ).all()
    exclude = {current_user.id} | {c.requester_id for c in related} | {c.addressee_id for c in related}
    candidates = User.query.filter(User.id.notin_(exclude)).all()
    ranked = sorted(
        ({"user": u, "mutual": mutual_count(mine, u.id)} for u in candidates),
        key=lambda r: (-r["mutual"], r["user"].id),
    )
    return {
        "people": [
            {
                **r["user"].to_summary(),
                "banner_photo": r["user"].banner_photo,
                "mutual_count": r["mutual"],
            }
            for r in ranked[:limit]
        ]
    }
