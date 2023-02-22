from app.models import db, User,Post, environment, SCHEMA


def seed_posts():
    p1 = Post(
        user_id='1', post_content="this is a testing post1", post_photo="https://media.istockphoto.com/id/952729630/photo/test-pushing-keyboard-with-finger-3d-illustration.jpg?s=612x612&w=is&k=20&c=H9Ao_VuwDGk1eGutJAOUrgkEKiJCj0Z9_qreA4ux0fY=")
    p2 = Post(
        user_id='2', post_content="this is a testing post2", post_photo="")
    p3 = Post(
        user_id='3', post_content="this is a testing post3", post_photo="")
    p4 = Post(
        user_id='4', post_content="this is a testing post4", post_photo="")
    p5 = Post(
        user_id='5', post_content="this is a testing post5", post_photo="")
    p6 = Post(
        user_id='6', post_content="this is a testing post6", post_photo="")
    p7 = Post(
        user_id='7', post_content="this is a testing post7", post_photo="")
    p8 = Post(
        user_id='8', post_content="this is a testing post8", post_photo="")
    p9 = Post(
        user_id='9', post_content="this is a testing post9", post_photo="")
    p10 = Post(
        user_id='10', post_content="this is a testing post10", post_photo="")

    all_posts = [p1, p2, p3, p4, p5, p6, p7, p8 ,p9, p10]
    add_posts = [db.session.add(post) for post in all_posts]
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM posts")
        
    db.session.commit()