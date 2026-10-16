from .db import add_prefix_for_prod, db, iso, table_args, utcnow


class ConversationParticipant(db.Model):
    __tablename__ = "conversation_participants"
    __table_args__ = table_args()

    conversation_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("conversations.id")), primary_key=True
    )
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True)
    last_read_at = db.Column(db.DateTime)

    user = db.relationship("User")
    conversation = db.relationship("Conversation", back_populates="participants")


class Conversation(db.Model):
    __tablename__ = "conversations"
    __table_args__ = table_args()

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    participants = db.relationship(
        "ConversationParticipant", back_populates="conversation", cascade="all, delete-orphan"
    )
    messages = db.relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )

    def participant(self, user_id):
        return next((p for p in self.participants if p.user_id == user_id), None)

    def others(self, user_id):
        return [p.user for p in self.participants if p.user_id != user_id]

    def is_unread_for(self, user_id):
        me = self.participant(user_id)
        last = self.messages[-1] if self.messages else None
        if not me or not last or last.sender_id == user_id:
            return False
        return me.last_read_at is None or last.created_at > me.last_read_at

    def to_summary(self, viewer_id):
        last = self.messages[-1] if self.messages else None
        return {
            "id": self.id,
            "participants": [u.to_summary() for u in self.others(viewer_id)],
            "last_message": last.to_dict() if last else None,
            "updated_at": iso(self.updated_at),
            "unread": self.is_unread_for(viewer_id),
        }


class Message(db.Model):
    __tablename__ = "messages"
    __table_args__ = table_args()

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("conversations.id")), nullable=False
    )
    sender_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    sender = db.relationship("User")
    conversation = db.relationship("Conversation", back_populates="messages")

    def to_dict(self):
        return {
            "id": self.id,
            "conversation_id": self.conversation_id,
            "sender": self.sender.to_summary(),
            "content": self.content,
            "created_at": iso(self.created_at),
            "edited": (self.updated_at - self.created_at).total_seconds() > 1,
        }
