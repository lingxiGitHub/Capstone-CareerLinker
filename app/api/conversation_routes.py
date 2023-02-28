# from flask import Blueprint, jsonify,request,session
# from flask_login import login_required,current_user
# from app.models import db
# from app.models import User,Conversation,Message


# conversation_routes=Blueprint("conversations",__name__)

# #get all conversations
# @conversation_routes.route("/")
# def conversations():
#     all_conversations=Conversation.query.all()
#     # print("&&&&&",all_conversations.to_dict())
#     all_users=User.query.all()
#     all_messages=Message.query.all()

#     data={"conversations":[{
#         "conversation_id":conversation.id
#     }for conversation in all_conversations]}

#     return data