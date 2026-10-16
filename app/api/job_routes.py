from flask import Blueprint, request
from flask_login import current_user, login_required

from app.models import Job, JobApplication, SavedJob, db

from .utils import ApiError, body, get_or_404, optional_text

job_routes = Blueprint("jobs", __name__)


def viewer_sets():
    saved = {s.job_id for s in SavedJob.query.filter_by(user_id=current_user.id).all()}
    applied = {a.job_id for a in JobApplication.query.filter_by(user_id=current_user.id).all()}
    return saved, applied


@job_routes.route("/")
@login_required
def jobs():
    query = Job.query
    q = (request.args.get("q") or "").strip()
    location = (request.args.get("location") or "").strip()
    workplace = (request.args.get("workplace") or "").strip()
    view = request.args.get("view")

    if q:
        like = f"%{q}%"
        query = query.filter(db.or_(Job.title.ilike(like), Job.company.ilike(like), Job.description.ilike(like)))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if workplace:
        query = query.filter(Job.workplace_type == workplace)

    saved, applied = viewer_sets()
    if view == "saved":
        query = query.filter(Job.id.in_(saved))
    elif view == "applied":
        query = query.filter(Job.id.in_(applied))

    results = query.order_by(Job.created_at.desc()).all()
    return {"jobs": [j.to_dict(saved, applied) for j in results]}


@job_routes.route("/<int:job_id>")
@login_required
def job(job_id):
    saved, applied = viewer_sets()
    return get_or_404(Job, job_id, "Job").to_dict(saved, applied)


@job_routes.route("/<int:job_id>/save", methods=["PUT"])
@login_required
def save(job_id):
    get_or_404(Job, job_id, "Job")
    if not db.session.get(SavedJob, (current_user.id, job_id)):
        db.session.add(SavedJob(user_id=current_user.id, job_id=job_id))
        db.session.commit()
    return job(job_id)


@job_routes.route("/<int:job_id>/save", methods=["DELETE"])
@login_required
def unsave(job_id):
    SavedJob.query.filter_by(user_id=current_user.id, job_id=job_id).delete()
    db.session.commit()
    return job(job_id)


@job_routes.route("/<int:job_id>/apply", methods=["POST"])
@login_required
def apply(job_id):
    get_or_404(Job, job_id, "Job")
    if JobApplication.query.filter_by(user_id=current_user.id, job_id=job_id).first():
        raise ApiError("You've already applied to this job")
    data = body()
    db.session.add(
        JobApplication(
            user_id=current_user.id,
            job_id=job_id,
            phone=optional_text(data, "phone", 30),
            note=optional_text(data, "note", 2000),
        )
    )
    db.session.commit()
    return job(job_id), 201
