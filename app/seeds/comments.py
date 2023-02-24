from app.models import db, User,Post,Comment, environment, SCHEMA


def seed_comments():
    c1 = Comment(
        user_id='10', post_id="1",comment_content="this is a testing comment1")
    c2 = Comment(
        user_id='9', post_id="1",comment_content="this is a testing comment2")
    c3 = Comment(
        user_id='8', post_id="2",comment_content="this is a testing comment3")
    c4 = Comment(
        user_id='7', post_id="3",comment_content="this is a testing comment4")
    c5 = Comment(
        user_id='6', post_id="4",comment_content="this is a testing comment5")
    c6 = Comment(
        user_id='5', post_id="5",comment_content="this is a testing comment6")
    c7 = Comment(
        user_id='4', post_id="6",comment_content="this is a testing comment7")
    c8 = Comment(
        user_id='3', post_id="7",comment_content="this is a testing comment8")
    c9 = Comment(
        user_id='2', post_id="8",comment_content="this is a testing comment9")
    c10 = Comment(
        user_id='1', post_id="9",comment_content="this is a testing comment10")
    c11 = Comment(
        user_id='1', post_id="10",comment_content="this is a testing comment11")
    

    all_comments = [c1, c2, c3, c4, c5, c6, c7, c8 ,c9, c10, c11]
    add_posts = [db.session.add(comment) for comment in all_comments]
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