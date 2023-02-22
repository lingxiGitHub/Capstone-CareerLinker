from flask_wtf import FlaskForm

from wtforms import IntegerField, StringField, TextAreaField
from wtforms.validators import DataRequired

class PostForm(FlaskForm):

  user_id=IntegerField("user_id",validators=[DataRequired()])
  post_content = StringField("post_content",validators=[DataRequired()])
  post_photo = TextAreaField("post_photo")
  

