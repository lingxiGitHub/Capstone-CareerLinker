from app.models import db, User, environment, SCHEMA

demo = User(
        username='Demo', email='demo@aa.io', password='password', first_name="Demo", last_name="User", title="Social Media Manager at Summit Solutions",profile_photo="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")
marnie = User(
        username='marnie', email='marnie@aa.io', password='password', first_name="Marnie", last_name="Stevens",title="Content Writer at BrightBridge", profile_photo="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80")
bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password', first_name="Bobbie", last_name="Jackson",title="Financial Analyst at StellarWorks",profile_photo="https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80")
tommy = User(
        username='Tommy-Bahama', email='Tommy_Bahama@hotmail.com', password='password', first_name="Tommy", last_name="Bahama",title="HR Coordinator at TechHive",profile_photo="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80")
eleanor = User(
        username='Eleanor-Auker', email='Eleanor_Auker@hotmail.com', password='password', first_name="Eleanor", last_name="Auker",title="Product Manager at Streamline Solutions",profile_photo="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80")
james = User(
        username='James-Bacher', email='James_Bacher@hotmail.com', password='password', first_name="James", last_name="Bacher",title="Software Developer at CrystalPeak",profile_photo="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1448&q=80")
hazel = User(
        username='Hazel-Zane', email='Hazel_Zane@hotmail.com', password='password', first_name="Hazel", last_name="Zane",title="Graphic Designer at NexusTech",profile_photo="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=689&q=80")
ellis = User(
        username='Ellis-Wink', email='Ellis_Wink@hotmail.com', password='password', first_name="Ellis", last_name="Wink",title="Customer Service Representative at Skybridge Group",profile_photo="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80")
audrey = User(
        username='Audrey-Wherry', email='Audrey_Wherry@hotmail.com', password='password', first_name="Audrey", last_name="Wherry",title="Business Development Associate at Visionary Ventures",profile_photo="https://images.unsplash.com/photo-1506863530036-1efeddceb993?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1044&q=80")
olive = User(
        username='Olive-Tomson', email='Olive_Tomson@hotmail.com', password='password', first_name="Olive", last_name="Tomson",title="Operations Manager at NextGen Innovations",profile_photo="https://images.unsplash.com/photo-1530268729831-4b0b9e170218?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")
william = User(
        username='William-Tandy', email='William_Tandy@hotmail.com', password='password', first_name="William", last_name="Tandy",title="Sales Executive at Quantum Leap Solutions",profile_photo="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80")
charlie = User(
        username='Charlie-Staple', email='Charlie_Staple@hotmail.com', password='password', first_name="Charlie", last_name="Staple",title="Sales Operations Analyst at Elevate Enterprises",profile_photo="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")
ivy = User(
        username='Ivy-Rosemond', email='Ivy_Rosemond@hotmail.com', password='password', first_name="Ivy", last_name="Rosemond",title="Business Analyst at BrightBridge",profile_photo="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80")
ella = User(
        username='Ella-Tolly', email='Ella_Tolly@hotmail.com', password='password', first_name="Ella", last_name="Tolly",title="Marketing Coordinator at SummitX",profile_photo="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80")
adrian = User(
        username='Adrian', email='Adrian@gmail.com', password='adrianiscool', first_name='Adrian', last_name='Tran',title="Project Manager at RedRock Group",profile_photo="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")

# Adds a demo user, you can add other users here if you want
def seed_users():

    
    userList = [demo, marnie, bobbie, tommy, eleanor, james, hazel,
                ellis, audrey, olive, william, charlie, ivy, ella, adrian]

    add_users = [db.session.add(user) for user in userList]
    
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users")
        
    db.session.commit()