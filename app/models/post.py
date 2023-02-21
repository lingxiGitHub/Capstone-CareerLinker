from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
from .user import User

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get('SCHEMA')

class Post(db.Model):
    __tablename__ = 'posts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)
    post = db.Column(db.String(500), nullable=False)
    post_photo = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    user = db.relationship("User", back_populates="posts")
    

    def to_dict(self):
        return {
            'id': self.id,
            "user_id" : self.user_id,
            "post" : self.post,
            "post_photo":self.post_photo,
            "created_at":self.created_at,
            "updated_at":self.updated_at,
        }
