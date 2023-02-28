from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
# from .user import User
# from .conversation import Conversation

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get('SCHEMA')

class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)
    conversation_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('conversations.id')),nullable=False)
    message_content = db.Column(db.String(1000), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    #user to message: one to many
    user = db.relationship("User", back_populates="messages_users")
    #conversation to message: one to many
    conversation = db.relationship("Conversation", back_populates="messages")

    def to_dict(self):
        return {
            'id': self.id,
            "user_id" : self.user_id,
            "conversation_id":self.conversation_id,
            "message_content" : self.message_content,
            "created_at":self.created_at,
            "updated_at":self.updated_at,
        }
