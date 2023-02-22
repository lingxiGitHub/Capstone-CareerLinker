from flask import Blueprint, jsonify,request,session
from flask_login import login_required,current_user
from app.models import db
from app.models import User
from app.models import Post
from app.forms import PostForm

post_routes=Blueprint("posts",__name__)

#get all posts
@post_routes.route("/")
def posts():
    all_posts = Post.query.all()
    # print(all_posts[0].to_dict())
    all_users=User.query.all()
    # print(all_users.to_dict())

    for post in all_posts:
        print(post.id)
        post.user_first_name=None
        post.user_last_name=None
        for user in all_users:
            if post.user_id ==user.id:
                post.user_first_name=user.first_name
                post.user_last_name=user.last_name

    
    data = {
        "posts":[{
            "post_id":post.id,
            "post_user_id":post.user_id,
            "post_user_first_name":post.user_first_name,
            "post_user_last_name":post.user_last_name,
            "post":post.post,
            "post_photo":post.post_photo,
            "created_at":post.created_at,
            "updated_at":post.updated_at
        } for post in all_posts]
    }

    return data

#create a post
@post_routes.route('/', methods=["POST", "GET"])
# @login_required
def create_post():

  form = PostForm()
  form["csrf_token"].data = request.cookies["csrf_token"]

  if form.validate_on_submit():
    post = Post(
      user_id = int(current_user.id),
      post = request.get_json()["post"],
      post_photo = request.get_json()["post_photo"],
      
    )


    db.session.add(post)

    db.session.commit()
    return post.to_dict()
  if form.errors:
    return form.errors