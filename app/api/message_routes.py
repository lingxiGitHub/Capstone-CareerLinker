from flask import Blueprint
from flask_login import current_user, login_required

from app.models import Conversation, ConversationParticipant, Message, User, db, utcnow

from .utils import ApiError, body, forbid_unless, get_or_404, require_text

message_routes = Blueprint("messaging", __name__)


def my_conversation(conversation_id):
    convo = get_or_404(Conversation, conversation_id, "Conversation")
    forbid_unless(convo.participant(current_user.id) is not None)
    return convo


def find_direct_conversation(a, b):
    mine = {
        p.conversation_id
        for p in ConversationParticipant.query.filter_by(user_id=a).all()
    }
    for p in ConversationParticipant.query.filter(
        ConversationParticipant.user_id == b, ConversationParticipant.conversation_id.in_(mine)
    ).all():
        if len(p.conversation.participants) == 2:
            return p.conversation
    return None


def mark_read(convo):
    convo.participant(current_user.id).last_read_at = utcnow()
    db.session.commit()


def detail(convo):
    return {
        **convo.to_summary(current_user.id),
        "messages": [m.to_dict() for m in convo.messages],
    }


@message_routes.route("/conversations")
@login_required
def conversations():
    convos = (
        Conversation.query.join(ConversationParticipant)
        .filter(ConversationParticipant.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )
    return {"conversations": [c.to_summary(current_user.id) for c in convos if c.messages]}


@message_routes.route("/conversations", methods=["POST"])
@login_required
def start_conversation():
    """Send a message to a member, reusing your existing thread with them if there is one."""
    data = body()
    other = get_or_404(User, data.get("user_id"), "Member")
    if other.id == current_user.id:
        raise ApiError("You can't message yourself")
    content = require_text(data, "content", "Message", 5000)

    convo = find_direct_conversation(current_user.id, other.id)
    if not convo:
        convo = Conversation()
        convo.participants = [
            ConversationParticipant(user_id=current_user.id),
            ConversationParticipant(user_id=other.id),
        ]
        db.session.add(convo)
        db.session.flush()

    now = utcnow()
    db.session.add(Message(conversation_id=convo.id, sender_id=current_user.id, content=content))
    convo.updated_at = now
    convo.participant(current_user.id).last_read_at = now
    db.session.commit()
    db.session.refresh(convo)
    return detail(convo), 201


@message_routes.route("/conversations/with/<int:user_id>")
@login_required
def conversation_with(user_id):
    convo = find_direct_conversation(current_user.id, user_id)
    return {"id": convo.id if convo else None}


@message_routes.route("/conversations/<int:conversation_id>")
@login_required
def get_conversation(conversation_id):
    convo = my_conversation(conversation_id)
    if convo.is_unread_for(current_user.id):
        mark_read(convo)
    return detail(convo)


@message_routes.route("/conversations/<int:conversation_id>/messages", methods=["POST"])
@login_required
def send(conversation_id):
    convo = my_conversation(conversation_id)
    now = utcnow()
    db.session.add(
        Message(
            conversation_id=convo.id,
            sender_id=current_user.id,
            content=require_text(body(), "content", "Message", 5000),
        )
    )
    convo.updated_at = now
    convo.participant(current_user.id).last_read_at = now
    db.session.commit()
    db.session.refresh(convo)
    return detail(convo), 201


@message_routes.route("/messages/<int:message_id>", methods=["PUT"])
@login_required
def edit_message(message_id):
    msg = get_or_404(Message, message_id, "Message")
    forbid_unless(msg.sender_id == current_user.id)
    msg.content = require_text(body(), "content", "Message", 5000)
    db.session.commit()
    return detail(msg.conversation)


@message_routes.route("/messages/<int:message_id>", methods=["DELETE"])
@login_required
def delete_message(message_id):
    msg = get_or_404(Message, message_id, "Message")
    forbid_unless(msg.sender_id == current_user.id)
    convo = msg.conversation
    db.session.delete(msg)
    db.session.commit()
    db.session.refresh(convo)
    return detail(convo)
