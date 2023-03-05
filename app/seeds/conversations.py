from app.models import db, User,Post,Comment,Conversation, environment, SCHEMA
from .users import demo,marnie,bobbie,tommy

def seed_conversations():
    con1= Conversation (
      users=[demo,marnie]
    )

    con2= Conversation (
      users=[demo,bobbie]
    )

    con3= Conversation(
        users=[marnie,tommy]
    )

    all_conversations = [con1,con2,con3]
    add_conversations=[db.session.add(conversation) for conversation in all_conversations]
    db.session.commit()

    
def undo_conversations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.conversations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM conversations")
        
    db.session.commit()