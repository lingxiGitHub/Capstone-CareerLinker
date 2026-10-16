from flask import Blueprint
from flask_login import current_user, login_required

from app.models import REACTION_TYPES, Comment, Connection, Post, Reaction, db

from .utils import ApiError, body, forbid_unless, get_or_404, optional_text, pagination, require_text

post_routes = Blueprint("posts", __name__)


def serialize(post):
    return post.to_dict(current_user.id, Connection.connected_ids(current_user.id))


@post_routes.route("/")
@login_required
def feed():
    offset, limit = pagination()
    posts = Post.query.order_by(Post.created_at.desc()).offset(offset).limit(limit + 1).all()
    connected = Connection.connected_ids(current_user.id)
    return {
        "posts": [p.to_dict(current_user.id, connected) for p in posts[:limit]],
        "has_more": len(posts) > limit,
    }


@post_routes.route("/<int:post_id>")
@login_required
def get_post(post_id):
    return serialize(get_or_404(Post, post_id, "Post"))


@post_routes.route("/", methods=["POST"])
@login_required
def create_post():
    data = body()
    post = Post(
        user_id=current_user.id,
        content=require_text(data, "content", "Post", 3000),
        image_url=optional_text(data, "image_url", 1000),
    )
    db.session.add(post)
    db.session.commit()
    return serialize(post), 201


@post_routes.route("/<int:post_id>", methods=["PUT"])
@login_required
def edit_post(post_id):
    post = get_or_404(Post, post_id, "Post")
    forbid_unless(post.user_id == current_user.id)
    data = body()
    post.content = require_text(data, "content", "Post", 3000)
    post.image_url = optional_text(data, "image_url", 1000)
    db.session.commit()
    return serialize(post)


@post_routes.route("/<int:post_id>", methods=["DELETE"])
@login_required
def delete_post(post_id):
    post = get_or_404(Post, post_id, "Post")
    forbid_unless(post.user_id == current_user.id)
    db.session.delete(post)
    db.session.commit()
    return {"id": post_id}


@post_routes.route("/<int:post_id>/reaction", methods=["PUT"])
@login_required
def react(post_id):
    post = get_or_404(Post, post_id, "Post")
    kind = body().get("type", "like")
    if kind not in REACTION_TYPES:
        raise ApiError("Unknown reaction")
    reaction = Reaction.query.filter_by(user_id=current_user.id, post_id=post.id).first()
    if reaction:
        reaction.type = kind
    else:
        db.session.add(Reaction(user_id=current_user.id, post_id=post.id, type=kind))
    db.session.commit()
    db.session.refresh(post)
    return serialize(post)


@post_routes.route("/<int:post_id>/reaction", methods=["DELETE"])
@login_required
def unreact(post_id):
    post = get_or_404(Post, post_id, "Post")
    Reaction.query.filter_by(user_id=current_user.id, post_id=post.id).delete()
    db.session.commit()
    db.session.refresh(post)
    return serialize(post)


@post_routes.route("/<int:post_id>/reactions")
@login_required
def reactions(post_id):
    post = get_or_404(Post, post_id, "Post")
    return {"reactions": [r.to_dict() for r in sorted(post.reactions, key=lambda r: r.created_at, reverse=True)]}


@post_routes.route("/<int:post_id>/comments", methods=["POST"])
@login_required
def add_comment(post_id):
    post = get_or_404(Post, post_id, "Post")
    db.session.add(
        Comment(
            user_id=current_user.id,
            post_id=post.id,
            content=require_text(body(), "content", "Comment", 1250),
        )
    )
    db.session.commit()
    db.session.refresh(post)
    return serialize(post), 201


@post_routes.route("/comments/<int:comment_id>", methods=["PUT"])
@login_required
def edit_comment(comment_id):
    comment = get_or_404(Comment, comment_id, "Comment")
    forbid_unless(comment.user_id == current_user.id)
    comment.content = require_text(body(), "content", "Comment", 1250)
    db.session.commit()
    return serialize(comment.post)


@post_routes.route("/comments/<int:comment_id>", methods=["DELETE"])
@login_required
def delete_comment(comment_id):
    """Comment authors can delete their comments; post authors can remove any comment on their post."""
    comment = get_or_404(Comment, comment_id, "Comment")
    post = comment.post
    forbid_unless(current_user.id in (comment.user_id, post.user_id))
    db.session.delete(comment)
    db.session.commit()
    db.session.refresh(post)
    return serialize(post)
