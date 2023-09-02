from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError("Email address is already in use.")


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError("Username is already in use.")


class SignUpForm(FlaskForm):
    username = StringField("username", validators=[DataRequired(), username_exists])
    first_name = StringField(
        "first_name",
        validators=[
            DataRequired(),
            Length(
                min=2, max=20, message="First name must be between 2 - 20 charaters"
            ),
        ],
    )
    last_name = StringField(
        "last_name",
        validators=[
            DataRequired(),
            Length(min=2, max=20, message="Last name must be between 2 - 20 charaters"),
        ],
    )
    email = StringField("email", validators=[DataRequired(), user_exists])
    password = StringField(
        "password",
        validators=[
            DataRequired(),
            Length(min=4, max=20, message="Password must be between 4 - 20 charaters"),
        ],
    )
    profile_photo = StringField(
        "profile_photo",
        default="https://media.istockphoto.com/id/522855255/vector/male-profile-flat-blue-simple-icon-with-long-shadow.jpg?s=612x612&w=0&k=20&c=EQa9pV1fZEGfGCW_aEK5X_Gyob8YuRcOYCYZeuBzztM=",
    )
    title = StringField("title", default="default title")
