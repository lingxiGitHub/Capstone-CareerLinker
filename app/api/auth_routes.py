import re

from flask import Blueprint
from flask_login import current_user, login_user, logout_user

from app.models import User, db

from .utils import ApiError, body, require_text

auth_routes = Blueprint("auth", __name__)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@auth_routes.route("/")
def authenticate():
    """Return the logged-in user, or null when signed out."""
    if current_user.is_authenticated:
        return {"user": current_user.to_dict()}
    return {"user": None}


@auth_routes.route("/login", methods=["POST"])
def login():
    data = body()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = User.query.filter(db.func.lower(User.email) == email).first()
    if not user or not user.check_password(password):
        raise ApiError(
            "That email and password combination isn't right. Try again.",
            401,
            {"password": "Wrong email or password. Try again."},
        )
    login_user(user, remember=True)
    return {"user": user.to_dict()}


@auth_routes.route("/demo", methods=["POST"])
def demo():
    user = User.query.filter_by(email="demo@careerlinker.io").first()
    if not user:
        raise ApiError("Demo user is not seeded", 404)
    login_user(user, remember=True)
    return {"user": user.to_dict()}


@auth_routes.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return {"user": None}


@auth_routes.route("/signup", methods=["POST"])
def sign_up():
    data = body()
    first_name = require_text(data, "first_name", "First name", 40)
    last_name = require_text(data, "last_name", "Last name", 40)
    email = require_text(data, "email", "Email", 255).lower()
    password = data.get("password") or ""

    if not EMAIL_RE.match(email):
        raise ApiError("Please enter a valid email address", errors={"email": "Please enter a valid email address"})
    if User.query.filter(db.func.lower(User.email) == email).first():
        raise ApiError("Someone's already using that email", errors={"email": "Someone's already using that email"})
    if len(password) < 6:
        raise ApiError("Password must be 6 characters or more", errors={"password": "Password must be 6 characters or more"})

    user = User(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        headline=(data.get("headline") or "").strip() or None,
        location=(data.get("location") or "").strip() or None,
    )
    db.session.add(user)
    db.session.commit()
    login_user(user, remember=True)
    return {"user": user.to_dict()}, 201


@auth_routes.route("/unauthorized")
def unauthorized():
    raise ApiError("Please sign in to continue", 401)
