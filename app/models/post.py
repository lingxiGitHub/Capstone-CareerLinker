from .db import add_prefix_for_prod, db, iso, table_args, utcnow

REACTION_TYPES = ("like", "celebrate", "support", "love", "insightful", "funny")


class Post(db.Model):
    __tablename__ = "posts"
    __table_args__ = table_args()

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(1000))
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    author = db.relationship("User", back_populates="posts")
    comments = db.relationship(
        "Comment",
        back_populates="post",
        cascade="all, delete-orphan",
        order_by="Comment.created_at",
    )
    reactions = db.relationship("Reaction", back_populates="post", cascade="all, delete-orphan")

    def to_dict(self, viewer_id=None, connected_ids=frozenset()):
        counts = {}
        my_reaction = None
        for r in self.reactions:
            counts[r.type] = counts.get(r.type, 0) + 1
            if r.user_id == viewer_id:
                my_reaction = r.type
        top = sorted(counts, key=counts.get, reverse=True)[:3]
        return {
            "id": self.id,
            "author": {
                **self.author.to_summary(),
                "is_connected": self.user_id in connected_ids,
            },
            "content": self.content,
            "image_url": self.image_url,
            "created_at": iso(self.created_at),
            "edited": (self.updated_at - self.created_at).total_seconds() > 1,
            "reaction_count": len(self.reactions),
            "top_reactions": top,
            "my_reaction": my_reaction,
            "recent_reactors": [
                r.user.first_name + " " + r.user.last_name
                for r in sorted(self.reactions, key=lambda r: r.created_at, reverse=True)[:1]
            ],
            "comment_count": len(self.comments),
            "comments": [c.to_dict() for c in self.comments],
        }


class Reaction(db.Model):
    __tablename__ = "reactions"
    __table_args__ = table_args(db.UniqueConstraint("user_id", "post_id"))

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), nullable=False)
    type = db.Column(db.String(20), nullable=False, default="like")
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    user = db.relationship("User")
    post = db.relationship("Post", back_populates="reactions")

    def to_dict(self):
        return {"type": self.type, "user": self.user.to_summary()}


class Comment(db.Model):
    __tablename__ = "comments"
    __table_args__ = table_args()

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), nullable=False)
    content = db.Column(db.String(1250), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    author = db.relationship("User")
    post = db.relationship("Post", back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "author": self.author.to_summary(),
            "content": self.content,
            "created_at": iso(self.created_at),
            "edited": (self.updated_at - self.created_at).total_seconds() > 1,
        }
