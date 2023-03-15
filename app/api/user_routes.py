from flask import Blueprint, jsonify,request
from flask_login import login_required,current_user
from app.models import User, Connection
from app.forms import SignUpForm
from app.models import db
# from app.models.connection import connections

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


#determine if the other user is connected with current user
@user_routes.route("/connected/<int:otherUserId>")
@login_required
def connected(otherUserId):
    current_user_id=current_user.id
    connection = Connection.query.filter(
        (Connection.user_id == current_user_id) & (Connection.connected_user_id == otherUserId)
        | (Connection.user_id == otherUserId) & (Connection.connected_user_id == current_user_id)
    ).first()

    if connection:
        return jsonify({'connected': True})
    else:
        return jsonify({'connected': False})
    


#get all of current user connections
@user_routes.route("/connections")
@login_required
def get_current_user_connections():
    all_connections = Connection.query.all()
    all_users=User.query.all()
    current_user_id=current_user.id
    connected_user=[]

    for connection in all_connections:
        print(connection.to_dict())
        if connection.user_id==current_user_id:
            connected_user.append(connection.connected_user_id)
        if connection.connected_user_id == current_user_id:
            connected_user.append(connection.user_id)
    print(connected_user)

    result={}
    for id in connected_user:
        for user in all_users:
            if user.id==id:
                result[id]={

                    "first_name":user.first_name,
                    "last_name":user.last_name,
                    "title":user.title,
                    "profile_photo":user.profile_photo
                }
            
    return result


#add a connection to current user
@user_routes.route("/add-connection",methods=["POST"])
@login_required
def add_a_connection():
  user_id = int(current_user.id)
  connected_user_id = request.get_json()["connected_user_id"]

  search=Connection.query.filter_by(user_id=user_id,connected_user_id=connected_user_id ).first()

  if search:
      return jsonify({'errors': "connection already exists"})
  elif user_id==connected_user_id:
      return jsonify({"errors":"users cannot connected to themselves"})
  else:
      connection=Connection(
      user_id = int(current_user.id),
      connected_user_id = request.get_json()["connected_user_id"],
      )
      db.session.add(connection)
      db.session.commit()
      return connection.to_dict()

  
