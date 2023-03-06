from app.models import db, User,Post,Comment,Conversation, environment, SCHEMA
from .users import demo, marnie, bobbie, tommy, eleanor, james, hazel, ellis, audrey, olive, william, charlie, ivy, ella, adrian

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
    con4= Conversation(
        users=[demo,tommy]
    )

    con5= Conversation(
        users=[demo,eleanor]
    )

    con6= Conversation(
        users=[marnie,bobbie]
    )
    con7= Conversation(
        users=[marnie,eleanor]
    )

    con8= Conversation(
        users=[bobbie,tommy]
    )

    con9= Conversation(
        users=[bobbie,eleanor]
    )

    con10= Conversation(
        users=[tommy,eleanor]
    )



    all_conversations = [con1,con2,con3,con4,con5,con6,con7,con8,con9,con10]
    add_conversations=[db.session.add(conversation) for conversation in all_conversations]
    db.session.commit()

    
def undo_conversations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.conversations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM conversations")
        
    db.session.commit()