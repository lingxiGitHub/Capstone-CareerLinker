from flask import Blueprint, jsonify,request,session
from flask_login import login_required,current_user
from app.models import db
from app.models import User,Conversation,Message


conversation_routes=Blueprint("conversations",__name__)

#get all conversations
@conversation_routes.route("/")
def conversations():
    all_conversations=Conversation.query.all()
    all_users=User.query.all()
    all_messages=Message.query.all()

    data=[]
    for conversation in all_conversations:
        print(conversation.id)
        messsages=[]
        for message in all_messages:
            if message.conversation_id == conversation.id:
                messsages.append({
                    message.user_id:message.message_content,
                    # message.created_at:message.created_at
                    }
                    )
        print(messsages)

        data.append({
            "conversation_id":conversation.id,
            "messages":messsages,
        })

    return data