from app.models import db, User, Post, Comment, Message, environment, SCHEMA

def seed_messages():
    m1=Message(
        user_id='1',
        conversation_id="1",
        message_content=" Hi there, have you had a chance to review the project proposal I sent you?"
    )

    m2=Message(
        user_id='2',
        conversation_id="1",
        message_content="Yes, I did. It looks like a solid plan. However, I have a few concerns about the timeline. It seems a bit tight."
    )
##############################

    m3=Message(
        user_id='1',
        conversation_id="2",
        message_content="Good morning, how was your weekend?"
    )

    m4=Message(
        user_id='3',
        conversation_id="2",
        message_content=" It was great, thanks for asking. How about yours?"
    )
##############################
    m5 = Message(
        user_id="2",
        conversation_id="3",
        message_content="I hope this message finds you well. I came across your profile on LinkedIn and was impressed by your skills and experience. I'm currently working on a search for a software position for one of our clients, and I think you would be a great fit."
    )

    m6 = Message(
        user_id="4",
        conversation_id="3",
        message_content="Hi There. I am interested. Please send more details. Thanks!"
    )
##############################
    m7 = Message(
        user_id="1",
        conversation_id="4",
        message_content="Hi, I saw that you work at ABC company before. I've been really interested in the work you guys do there."
    )

    m8 = Message(
        user_id="4",
        conversation_id="4",
        message_content="Hello, thanks for reaching out. I appreciate your interest. What can I help you with?"
    )
##############################
    m9 = Message(
        user_id="5",
        conversation_id="5",
        message_content="Have you heard about any job openings recently? I'm starting to look for something new."
    )

    m10 = Message(
        user_id="1",
        conversation_id="5",
        message_content="Actually, yes. I saw a few positions posted on LinkedIn that might be a good fit for you. What kind of work are you interested in?"
    )
##############################

    m11 = Message(
        user_id="2",
        conversation_id="6",
        message_content="It's really coming down out there, isn't it?"
    )

    m12 = Message(
        user_id="3",
        conversation_id="6",
        message_content="Yeah, it's been raining nonstop for the past few days. I'm starting to get sick of it."
    )
##############################


    m13 = Message(
        user_id="2",
        conversation_id="7",
        message_content="Hey, did you hear about the new project we're starting next month?"
    )

    m14 = Message(
        user_id="5",
        conversation_id="7",
        message_content="No, I haven't. What is it?"
    )
##############################


    m15 = Message(
        user_id="3",
        conversation_id="8",
        message_content="Hey! Long time no see!"
    )

    m16 = Message(
        user_id="4",
        conversation_id="8",
        message_content="Hi! Yes, it's been ages. How have you been?"
    )
##############################

    m17 = Message(
        user_id="3",
        conversation_id="9",
        message_content="I came across your profile on LinkedIn and I'm really impressed by your experience in software engineering."
    )

    m18 = Message(
        user_id="5",
        conversation_id="9",
        message_content="Hi, thanks for reaching out. I appreciate the compliment. What can I help you with?"
    )
##############################


    m19 = Message(
        user_id="4",
        conversation_id="10",
        message_content="I hope this message finds you well. I wanted to reach out and say thank you for connecting with me on LinkedIn. I appreciate the opportunity to expand my network and connect with professionals in my industry."
    )

    m20 = Message(
        user_id="5",
        conversation_id="10",
        message_content="Hi There. Thanks for reaching out. Happy connecting!"
    )
##############################
    all_messages = [m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15,m16,m17,m18,m19,m20]
    add_messages = [db.session.add(message) for message in all_messages]
    db.session.commit()

def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM messages")
        
    db.session.commit()