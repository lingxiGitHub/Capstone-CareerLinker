from flask import Blueprint, request
from flask_login import current_user, login_required

from app.models import Connection, Job, Post, User, db

search_routes = Blueprint("search", __name__)


@search_routes.route("/")
@login_required
def search():
    q = (request.args.get("q") or "").strip()
    if not q:
        return {"people": [], "posts": [], "jobs": []}
    like = f"%{q}%"
    full_name = User.first_name + " " + User.last_name

    people = (
        User.query.filter(
            db.or_(full_name.ilike(like), User.headline.ilike(like), User.location.ilike(like))
        )
        .limit(20)
        .all()
    )
    posts = Post.query.filter(Post.content.ilike(like)).order_by(Post.created_at.desc()).limit(10).all()
    jobs = (
        Job.query.filter(db.or_(Job.title.ilike(like), Job.company.ilike(like)))
        .order_by(Job.created_at.desc())
        .limit(10)
        .all()
    )

    connected = Connection.connected_ids(current_user.id)
    return {
        "people": [
            {
                **u.to_summary(),
                "location": u.location,
                "connection_status": Connection.status_for(current_user.id, u.id),
            }
            for u in people
        ],
        "posts": [p.to_dict(current_user.id, connected) for p in posts],
        "jobs": [j.to_dict() for j in jobs],
    }


@search_routes.route("/typeahead")
@login_required
def typeahead():
    q = (request.args.get("q") or "").strip()
    if not q:
        return {"people": []}
    full_name = User.first_name + " " + User.last_name
    people = User.query.filter(full_name.ilike(f"%{q}%")).limit(6).all()
    return {"people": [u.to_summary() for u in people]}
