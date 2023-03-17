from flask import Blueprint, jsonify,request,session
from flask_login import login_required,current_user
from app.models import db
from app.models import User,Conversation,Message
from app.forms import MessageForm

message_routes=Blueprint("messages",__name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

#get message of one conversation id
@message_routes.route("/conversations/<int:conversationId>/messages")
def get_message_by_conversation_id(conversationId):
    all_message = Message.query.all()
    all_conversation = Conversation.query.all()
    all_users=User.query.all()
    found_messages=Message.query.filter(Message.conversation_id == conversationId).all()
    data=[]
    for message in found_messages:
        data.append({
            "message_id":message.id,
            "message_user_id":message.user_id,
            "message_user_first_name":None,
            "message_user_last_name":None,
            "message_user_profile_photo":None,
            "message_user_title":None,
            "message_conversaton_id":message.conversation_id,
            "message_content":message.message_content,
            "message_created_at":message.created_at,
            "message_updated_at":message.updated_at,

        })
    for item in data:
       for user in all_users:
          if user.id == item["message_user_id"]:
             item["message_user_first_name"]=user.first_name
             item["message_user_last_name"]=user.last_name
             item["message_user_profile_photo"]=user.profile_photo
             item["message_user_title"]=user.title

    return data


#get all messages
@message_routes.route("/messages")
def messages():
    data=[]
    all_messsage = Message.query.all()
    for message in all_messsage:
        # print(message.to_dict())
        data.append({
            "message_id":message.id,
            "message_user_id":message.user_id,
            "message_conversaton_id":message.conversation_id,
            "message_content":message.message_content,
            "message_created_at":message.created_at,
            "message_updated_at":message.updated_at,
        })

    return data


#create a message
@message_routes.route("/messages",methods=["POST"])
# @login_required
def create_message():
   form=MessageForm()
   form["csrf_token"].data = request.cookies["csrf_token"]

   if form.validate_on_submit():
    message=Message(
        user_id=request.get_json()["user_id"],
        message_content=request.get_json()["message_content"],
        conversation_id=request.get_json()["conversation_id"]
    )

    db.session.add(message)
    db.session.commit()
    return message.to_dict()

   else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


#edit a message
@message_routes.route('/messages/<int:messageId>', methods=["PUT"])
@login_required
def edit_message_by_message_id(messageId):
  message = Message.query.get(messageId)
#   print("post at edit BE route--->",post.to_dict())
#   print("current user id ---->",current_user.id)
  if not message:
    return {"errors": ["Message couldn't be found"]}, 404

  form = MessageForm()
  form["csrf_token"].data = request.cookies["csrf_token"]

  if form.validate_on_submit():

    message.id=int(messageId)
    message.user_id = int(current_user.id)
    message.message_content = request.get_json()["message_content"]
    message.conversation_id = request.get_json()["conversation_id"]
   
  

    db.session.commit()
    return message.to_dict()


  else:
     return {'errors': validation_errors_to_error_messages(form.errors)}, 400

#delete a message

@message_routes.route("/messages/<int:messageId>",methods=["DELETE"])
@login_required
def delete_message(messageId):
   message=Message.query.get(messageId)

   if not message:
      return {"errors":["Message could not be found"]},404
   
   db.session.delete(message)
   db.session.commit()
   return {"message":["Message successfully deleted"]},200