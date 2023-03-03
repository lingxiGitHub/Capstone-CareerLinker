from flask_wtf import FlaskForm

from wtforms import IntegerField, StringField, TextAreaField
from wtforms.validators import DataRequired,Length

class PostForm(FlaskForm):

  user_id=IntegerField("user_id",validators=[DataRequired()])
  post_content = StringField("post_content",validators=[DataRequired(),Length(min=1,max=1000,message="Post must be between 1 - 1000 charaters")])
  post_photo = TextAreaField("post_photo")
  

