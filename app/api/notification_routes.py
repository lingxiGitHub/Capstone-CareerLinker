from flask import Blueprint
from flask_login import current_user, login_required

from app.models import Comment, Connection, Post, Reaction, db, utcnow
from app.models.db import iso

notification_routes = Blueprint("notifications", __name__)


def build_notifications(user, limit=50):
    """Notifications are derived from activity rather than stored, so they never drift."""
    items = []

    reactions = (
        Reaction.query.join(Post)
        .filter(Post.user_id == user.id, Reaction.user_id != user.id)
        .order_by(Reaction.created_at.desc())
        .limit(limit)
        .all()
    )
    for r in reactions:
        items.append({
            "id": f"reaction-{r.id}",
            "kind": "reaction",
            "reaction": r.type,
            "actor": r.user.to_summary(),
            "post_id": r.post_id,
            "snippet": r.post.content[:140],
            "created_at": r.created_at,
        })

    comments = (
        Comment.query.join(Post)
        .filter(Post.user_id == user.id, Comment.user_id != user.id)
        .order_by(Comment.created_at.desc())
        .limit(limit)
        .all()
    )
    for c in comments:
        items.append({
            "id": f"comment-{c.id}",
            "kind": "comment",
            "actor": c.author.to_summary(),
            "post_id": c.post_id,
            "snippet": c.content[:140],
            "created_at": c.created_at,
        })

    accepted = (
        Connection.query.filter_by(requester_id=user.id, status="accepted")
        .order_by(Connection.accepted_at.desc())
        .limit(limit)
        .all()
    )
    for c in accepted:
        items.append({
            "id": f"accepted-{c.id}",
            "kind": "connection_accepted",
            "actor": c.addressee.to_summary(),
            "created_at": c.accepted_at,
        })

    invites = Connection.query.filter_by(addressee_id=user.id, status="pending").limit(limit).all()
    for c in invites:
        items.append({
            "id": f"invite-{c.id}",
            "kind": "invitation",
            "actor": c.requester.to_summary(),
            "created_at": c.created_at,
        })

    items.sort(key=lambda i: i["created_at"], reverse=True)
    return items[:limit]


def unseen_notification_count(user):
    seen = user.notifications_seen_at
    return sum(1 for n in build_notifications(user) if seen is None or n["created_at"] > seen)


@notification_routes.route("/")
@login_required
def notifications():
    seen = current_user.notifications_seen_at
    return {
        "notifications": [
            {**n, "unread": seen is None or n["created_at"] > seen, "created_at": iso(n["created_at"])}
            for n in build_notifications(current_user)
        ]
    }


@notification_routes.route("/seen", methods=["POST"])
@login_required
def mark_seen():
    current_user.notifications_seen_at = utcnow()
    db.session.commit()
    return {"notifications": 0}
