from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, TextAreaField
from wtforms.validators import DataRequired

class MessageForm(FlaskForm):

    message_content = StringField("message_content",validators=[DataRequired()])
    user_id=IntegerField("user_id",validators=[DataRequired()])
    conversation_id=IntegerField("user_id",validators=[DataRequired()])