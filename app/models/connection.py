from .db import db, environment, SCHEMA, add_prefix_for_prod

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get('SCHEMA')

class Connection(db.Model):
    __tablename__="connections"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)
    connected_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)

    # status = db.Column(db.String(20))

    #user to connection: one to many
    # user = db.relationship('User', back_populates="connections")
    # connected_user = db.relationship('User', foreign_keys=[connected_user_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            "user_id" : self.user_id,
            "connected_user_id" : self.connected_user_id,
        }