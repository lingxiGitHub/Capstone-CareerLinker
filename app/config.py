import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLAlchemy only accepts "postgresql://", but Render/Heroku hand out "postgres://".
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///dev.db").replace(
        "postgres://", "postgresql://"
    )
    SQLALCHEMY_ECHO = os.environ.get("SQLALCHEMY_ECHO") == "1"
    WTF_CSRF_HEADERS = ["X-CSRFToken"]
    WTF_CSRF_TIME_LIMIT = None
    SESSION_COOKIE_SAMESITE = "Lax"
    REMEMBER_COOKIE_SAMESITE = "Lax"
