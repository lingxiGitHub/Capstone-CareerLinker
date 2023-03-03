from flask_wtf import FlaskForm

from wtforms import IntegerField, StringField, TextAreaField
from wtforms.validators import DataRequired,Length

class CommentForm(FlaskForm):

  user_id=IntegerField("user_id",validators=[DataRequired()])
  post_id=IntegerField("post_id",validators=[DataRequired()])
  comment_content = StringField("comment_content",validators=[DataRequired(),Length(min=1,max=500,message="Comment must be between 1 - 500 charaters")])
