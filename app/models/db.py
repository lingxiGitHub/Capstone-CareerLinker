import os
from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

db = SQLAlchemy()


def add_prefix_for_prod(attr):
    """Foreign keys need the schema prefix when deployed to Postgres on Render."""
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    return attr


def table_args(*constraints):
    """Build __table_args__ that include the production schema when needed."""
    if environment == "production":
        return (*constraints, {"schema": SCHEMA})
    return constraints


def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def iso(dt):
    """Serialize naive-UTC datetimes so the browser parses them as UTC."""
    return dt.isoformat() + "Z" if dt else None
