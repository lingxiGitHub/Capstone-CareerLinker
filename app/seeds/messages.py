from app.models import db, User, Post, Comment, Message, environment, SCHEMA

def seed_messages():
    m1=Message(
        user_id='1',
        conversation_id="1",
        message_content="Hello user 2, this is Demo."
    )

    m2=Message(
        user_id='2',
        conversation_id="1",
        message_content="Hello, Demo. This is user 2"
    )

    m3=Message(
        user_id='1',
        conversation_id="2",
        message_content="Hello user 3, this is Demo."
    )

    m4=Message(
        user_id='3',
        conversation_id="2",
        message_content="Hello, Demo. This is user 3"
    )

    all_messages = [m1,m2,m3,m4]
    add_messages = [db.session.add(message) for message in all_messages]
    db.session.commit()

def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM messages")
        
    db.session.commit()