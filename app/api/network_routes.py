from flask import Blueprint
from flask_login import current_user, login_required

from app.models import Connection, User, db, utcnow
from app.models.db import iso

from .utils import ApiError, body, forbid_unless, get_or_404, optional_text

network_routes = Blueprint("network", __name__)


@network_routes.route("/connections")
@login_required
def connections():
    rows = (
        Connection.query.filter(
            Connection.status == "accepted",
            db.or_(Connection.requester_id == current_user.id, Connection.addressee_id == current_user.id),
        )
        .order_by(Connection.accepted_at.desc())
        .all()
    )
    return {
        "connections": [
            {**c.other(current_user.id).to_summary(), "connected_at": iso(c.accepted_at)}
            for c in rows
        ]
    }


@network_routes.route("/invitations")
@login_required
def invitations():
    received = (
        Connection.query.filter_by(addressee_id=current_user.id, status="pending")
        .order_by(Connection.created_at.desc())
        .all()
    )
    sent = (
        Connection.query.filter_by(requester_id=current_user.id, status="pending")
        .order_by(Connection.created_at.desc())
        .all()
    )
    return {
        "received": [c.to_invitation(current_user.id) for c in received],
        "sent": [c.to_invitation(current_user.id) for c in sent],
    }


@network_routes.route("/invitations", methods=["POST"])
@login_required
def send_invitation():
    data = body()
    user_id = data.get("user_id")
    other = get_or_404(User, user_id, "Member")
    if other.id == current_user.id:
        raise ApiError("You can't connect with yourself")

    existing = Connection.between(current_user.id, other.id)
    if existing:
        # If they already invited us, sending an invite back accepts theirs.
        if existing.status == "pending" and existing.addressee_id == current_user.id:
            existing.status = "accepted"
            existing.accepted_at = utcnow()
            db.session.commit()
            return {"status": "connected"}
        raise ApiError("An invitation or connection already exists")

    db.session.add(
        Connection(
            requester_id=current_user.id,
            addressee_id=other.id,
            message=optional_text(data, "message", 300),
        )
    )
    db.session.commit()
    return {"status": "pending_sent"}, 201


@network_routes.route("/invitations/<int:inv_id>/accept", methods=["POST"])
@login_required
def accept(inv_id):
    inv = get_or_404(Connection, inv_id, "Invitation")
    forbid_unless(inv.addressee_id == current_user.id and inv.status == "pending")
    inv.status = "accepted"
    inv.accepted_at = utcnow()
    db.session.commit()
    return {"status": "connected", "user": inv.requester.to_summary()}


@network_routes.route("/invitations/<int:inv_id>", methods=["DELETE"])
@login_required
def ignore_or_withdraw(inv_id):
    """Ignore a received invitation, or withdraw one you sent."""
    inv = get_or_404(Connection, inv_id, "Invitation")
    forbid_unless(inv.status == "pending" and current_user.id in (inv.requester_id, inv.addressee_id))
    db.session.delete(inv)
    db.session.commit()
    return {"id": inv_id}


@network_routes.route("/users/<int:user_id>/invitation", methods=["DELETE"])
@login_required
def withdraw_to_user(user_id):
    inv = Connection.query.filter_by(
        requester_id=current_user.id, addressee_id=user_id, status="pending"
    ).first()
    if not inv:
        raise ApiError("No pending invitation to withdraw", 404)
    db.session.delete(inv)
    db.session.commit()
    return {"status": "none"}


@network_routes.route("/connections/<int:user_id>", methods=["DELETE"])
@login_required
def remove(user_id):
    conn = Connection.between(current_user.id, user_id)
    if not conn or conn.status != "accepted":
        raise ApiError("You aren't connected with this member", 404)
    db.session.delete(conn)
    db.session.commit()
    return {"status": "none"}
