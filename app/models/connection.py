from .db import add_prefix_for_prod, db, iso, table_args, utcnow


class Connection(db.Model):
    """A connection request; once accepted it is a mutual, first-degree connection."""

    __tablename__ = "connections"
    __table_args__ = table_args(db.UniqueConstraint("requester_id", "addressee_id"))

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    addressee_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    status = db.Column(db.String(10), nullable=False, default="pending")
    message = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    accepted_at = db.Column(db.DateTime)

    requester = db.relationship("User", foreign_keys=[requester_id])
    addressee = db.relationship("User", foreign_keys=[addressee_id])

    def other(self, user_id):
        return self.addressee if self.requester_id == user_id else self.requester

    @staticmethod
    def between(a, b):
        return Connection.query.filter(
            db.or_(
                db.and_(Connection.requester_id == a, Connection.addressee_id == b),
                db.and_(Connection.requester_id == b, Connection.addressee_id == a),
            )
        ).first()

    @staticmethod
    def connected_ids(user_id):
        rows = Connection.query.filter(
            Connection.status == "accepted",
            db.or_(Connection.requester_id == user_id, Connection.addressee_id == user_id),
        ).all()
        return {c.addressee_id if c.requester_id == user_id else c.requester_id for c in rows}

    @staticmethod
    def status_for(viewer_id, other_id):
        """How `other_id` relates to the viewer, from the viewer's point of view."""
        if viewer_id == other_id:
            return "self"
        conn = Connection.between(viewer_id, other_id)
        if not conn:
            return "none"
        if conn.status == "accepted":
            return "connected"
        return "pending_sent" if conn.requester_id == viewer_id else "pending_received"

    def to_invitation(self, viewer_id):
        return {
            "id": self.id,
            "user": self.other(viewer_id).to_summary(),
            "message": self.message,
            "created_at": iso(self.created_at),
        }
