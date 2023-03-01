from flask import Blueprint, jsonify,request,session
from flask_login import login_required,current_user
from app.models import db
from app.models import User,Conversation,Message

message_routes=Blueprint("messages",__name__)

#get message of one conversation id
@message_routes.route("/conversations/<int:conversationId>/messages")
def get_message_by_conversation_id(conversationId):
    all_message = Message.query.all()
    all_conversation = Conversation.query.all()
    found_messages=Message.query.filter(Message.conversation_id == conversationId).all()
    data=[]
    for message in found_messages:
        data.append({
            "message_id":message.id,
            "message_user_id":message.user_id,
            "message_conversaton_id":message.conversation_id,
            "message_content":message.message_content,
            "message_created_at":message.created_at,
            "message_updated_at":message.updated_at,

        })

    return data


#get all messages
@message_routes.route("/messages")
def messages():
    data=[]
    all_messsage = Message.query.all()
    for message in all_messsage:
        print(message.to_dict())
        data.append({
            "message_id":message.id,
            "message_user_id":message.user_id,
            "message_conversaton_id":message.conversation_id,
            "message_content":message.message_content,
            "message_created_at":message.created_at,
            "message_updated_at":message.updated_at,
        })

    return data





