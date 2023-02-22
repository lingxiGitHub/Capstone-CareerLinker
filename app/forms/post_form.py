from flask_wtf import FlaskForm

from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired

class PostForm(FlaskForm):

  user_id=IntegerField("user_id",validators=[DataRequired()])
  post = StringField("post",validators=[DataRequired()])
  post_photo = StringField("post_photo",validators=[DataRequired()])
  

