from app.models import db, User,Post,Comment, environment, SCHEMA


def seed_comments():
    c1 = Comment(
        user_id='10', post_id="1",comment_content="I know you will excel in this new role. Looking forward to seeing the amazing things you will accomplish in the future!")
    c2 = Comment(
        user_id='9', post_id="1",comment_content="Great news! Congratulations on your new position!")
    c3 = Comment(
        user_id='8', post_id="2",comment_content="Congratulations on your recent achievement, Marnie! Your hard work and dedication have clearly paid off, and it's inspiring to see you reach this milestone. ")
    c4 = Comment(
        user_id='7', post_id="3",comment_content="Thank you for sharing this!")
    c5 = Comment(
        user_id='6', post_id="4",comment_content="I appreciate your commitment to promoting diversity in your workplace. ")
    c6 = Comment(
        user_id='5', post_id="5",comment_content="Agree.")
    c7 = Comment(
        user_id='4', post_id="6",comment_content="You will be missed!")
    c701 = Comment(
        user_id='1', post_id="6",comment_content="Wish you all the best and keep in touch!")
    c8 = Comment(
        user_id='3', post_id="7",comment_content="You've hit the nail on the head with that idea.")
    c9 = Comment(
        user_id='2', post_id="8",comment_content="I completely agree that having a plan B is essential in today's fast-paced and unpredictable world. ")
    c10 = Comment(
        user_id='1', post_id="9",comment_content="I completely agree that family should always come first. When we prioritize our family relationships and responsibilities, we create a foundation of love, trust, and support that can help us navigate life's challenges with greater resilience and strength. ")
    c11 = Comment(
        user_id='1', post_id="10",comment_content="We love to have you in the team, Olive. I also strongly believe that building relationships is one of the most important things we can do to create a more connected and supportive world.")
    

    all_comments = [c1, c2, c3, c4, c5, c6, c7, c8 ,c9, c10, c11]
    add_comments = [db.session.add(comment) for comment in all_comments]
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM comments")
        
    db.session.commit()