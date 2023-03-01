from flask import Blueprint, jsonify,request,session
from flask_login import login_required,current_user
from app.models import db
from app.models import User
from app.models import Post
from app.models import Comment
from app.forms import CommentForm

comment_routes=Blueprint("comments",__name__)

#get all comments
@comment_routes.route("/comments")
def comments():
    all_comments = Comment.query.all()
    # print(all_posts[0].to_dict())
    all_users=User.query.all()
    # print(all_users.to_dict())

    for comment in all_comments:
        # print(post.id)
        comment.user_first_name=None
        comment.user_last_name=None
        comment.user_profile_photo=None
        for user in all_users:
            if comment.user_id ==user.id:
                comment.user_first_name=user.first_name
                comment.user_last_name=user.last_name
                comment.user_profile_photo=user.profile_photo

 
    
    data = {
        "comments":[{
            "comment_id":comment.id,
            "comment_user_id":comment.user_id,
            "comment_post_id":comment.post_id,
            "comment_user_first_name":comment.user_first_name,
            "comment_user_last_name":comment.user_last_name,
            "comment_user_profile_photo":comment.user_profile_photo,
            "comment_content":comment.comment_content,
            "created_at":comment.created_at,
            "updated_at":comment.updated_at
        } for comment in all_comments]
    }

    return data

#create a comment
@comment_routes.route('/posts/<int:postId>/comments', methods=["POST"])
@login_required
def create_comment(postId):
  post = Post.query.get(postId)

  if not post:
        return {"errors":["Post couldn't be found"]},404

  
  form = CommentForm()
  form["csrf_token"].data = request.cookies["csrf_token"]

  if form.validate_on_submit():

    comment = Comment(
      user_id = int(current_user.id),
      post_id = postId,
      comment_content = request.get_json()["comment_content"]
      
    )

    db.session.add(comment)
    db.session.commit()
    return comment.to_dict()

  if form.errors:
    return form.errors


    db.session.add(post)
    db.session.commit()
    return post.to_dict()

  if form.errors:
    return form.errors


#edit a post
@comment_routes.route('/posts/<int:postId>/comments/<int:commentId>', methods=["PUT"])
@login_required
def edit_comment_by_post_id(postId,commentId):
  post = Post.query.get(postId)

  if not post:
    return {"errors": ["post couldn't be found"]}, 404

  comment = Comment.query.get(commentId)

  if not comment:
    return {"errors": ["comment couldn't be found"]}, 404

  form = CommentForm()
  form["csrf_token"].data = request.cookies["csrf_token"]


  if form.validate_on_submit():

    comment.id=int(commentId)
    comment.user_id = int(current_user.id)
    comment.post_id = postId
    comment.comment_content = request.get_json()["comment_content"]
  

    db.session.commit()
    return comment.to_dict()


  if form.errors:
    return form.errors


#delete a post
@comment_routes.route('/posts/<int:postId>/comments/<int:commentId>',methods=["DELETE"])
@login_required
def delete_comment(postId,commentId):
    post=Post.query.get(postId)
    if not post:
        return {"errors":["Post could not be found"]},404
    
    comment=Comment.query.get(commentId)
    if not comment:
        return {"errors":["Comment could not be found"]},404
    
    db.session.delete(comment)
    db.session.commit()
    return {"message":["Comment successfully deleted"]},200