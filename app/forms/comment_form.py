from flask_wtf import FlaskForm

from wtforms import IntegerField, StringField, TextAreaField
from wtforms.validators import DataRequired

class CommentForm(FlaskForm):

  user_id=IntegerField("user_id",validators=[DataRequired()])
  post_id=IntegerField("post_id",validators=[DataRequired()])
  comment_content = StringField("comment_content",validators=[DataRequired()])
