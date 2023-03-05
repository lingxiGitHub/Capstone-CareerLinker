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
        # print(conversation.id)
        messsages=[]
        for message in all_messages:
            if message.conversation_id == conversation.id:
                messsages.append({
                    message.user_id:message.message_content,
                    # message.created_at:message.created_at
                    }
                    )
        # print(messsages)

        data.append({
            "conversation_id":conversation.id,
            "messages":messsages,
        })

    return data


#get all conversation for current user
@conversation_routes.route("/current")
def conversation_for_current_user():
    all_messages=Message.query.all()
    all_users=User.query.all()
    
    found_conversation_id=[]
    for message in all_messages:
        # print(message.to_dict())
        # print(current_user.id)
        if message.user_id == current_user.id:
            found_conversation_id.append(message.conversation_id)
            print(found_conversation_id)

        participants=[]
        for message in all_messages:
            for conversation_id in found_conversation_id:
                if message.conversation_id == conversation_id:
                    participants.append({ 
                        "conversation_id":message.conversation_id,
                        "participant_user_id":message.user_id,
                        "other":False,
                        "user_first_name":None,
                        "user_last_name":None,
                        "user_profile_photo":None,
                        "user_title":None
                        })
    print(participants)

    for item in participants:
        if item["participant_user_id"] != current_user.id:
            item["other"]=True
        for user in all_users:
            if item["participant_user_id"] == user.id:
                item["user_first_name"]=user.first_name
                item["user_last_name"]=user.last_name
                item["user_profile_photo"]=user.profile_photo
                item["user_title"]=user.title
    


    
    return participants