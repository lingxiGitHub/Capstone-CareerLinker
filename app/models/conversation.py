from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
# from .user import User
# from .message import Message
# ---- many to many ----
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import relationship
# from sqlalchemy.schema import Column, ForeignKey, Table
# from sqlalchemy.types import Integer, String
# ---- many to many ----
from .user import user_conversations

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get('SCHEMA')

# user_conversations=db.Table(
#     "user_conversations",
#     db.Model.metadata,
#     db.Column('users', db.Integer, db.ForeignKey('users.id'), primary_key=True),
#     db.Column('conversations', db.Integer, db.ForeignKey('conversations.id'), primary_key=True)
# )

class Conversation(db.Model):
    __tablename__ = 'conversations'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    # name =db.Column(db.String)
    # sender_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)
    # receiver_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    #user to conversation: many to many
    users = db.relationship(
        "User",
        secondary=user_conversations,
        back_populates="conversations",
        cascade="all, delete"
    )

    # conversation to message: one to many
    messages = db.relationship("Message", back_populates="conversation")

    def to_dict(self):
        return {
            'id': self.id,
            # "sender_id" : self.sender_id,
            # "receiver_id" : self.receiver_id,
            "created_at":self.created_at,
            "updated_at":self.updated_at,
        }
