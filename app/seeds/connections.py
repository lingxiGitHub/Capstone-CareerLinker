from app.models import db, User, Connection, environment, SCHEMA
from .users import (
    demo,
    marnie,
    bobbie,
    tommy,
    eleanor,
    james,
    hazel,
    ellis,
    audrey,
    olive,
    william,
    charlie,
    ivy,
    ella,
    adrian,
)

connection1 = Connection(
    user_id=1,
    connected_user_id=2,
)

connection2 = Connection(
    user_id=1,
    connected_user_id=3,
)

connection3 = Connection(
    user_id=2,
    connected_user_id=3,
)

connection4 = Connection(
    user_id=1,
    connected_user_id=4,
)

connection5 = Connection(
    user_id=2,
    connected_user_id=4,
)

connection6 = Connection(
    user_id=3,
    connected_user_id=4,
)


def seed_connections():
    connection_list = [
        connection1,
        connection2,
        connection3,
        connection4,
        connection5,
        connection6,
    ]

    add_connections = [db.session.add(connection) for connection in connection_list]

    db.session.commit()


def undo_connections():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.connections RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute("DELETE FROM connections")

    db.session.commit()
