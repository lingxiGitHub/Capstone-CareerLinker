from app.models import db, User,Post, environment, SCHEMA
from .users import demo, marnie, bobbie, tommy, eleanor, james, hazel, ellis, audrey, olive, william, charlie, ivy, ella, adrian


def seed_posts():
    p1 = Post(
        user_id='1',
        users=[audrey,demo,marnie],
        post_content="Exciting news! I am thrilled to announce that I have joined the incredible team at ABC Company as Software Engineer.As someone who is deeply passionate about Computer Science, I am honored to be a part of an organization that is committed to. I am thrilled to be joining a group of talented individuals who are dedicated to driving innovation and making a positive impact on the world.I am looking forward to bringing my expertise in CS to the table and working collaboratively with my new colleagues to achieve our shared goals.Thank you to everyone who has supported me on my professional journey thus far.I can't wait to see what we can accomplish together at ABC Company!", post_photo="https://media.licdn.com/dms/image/D5612AQEA3uvBa4Tfcg/article-cover_image-shrink_720_1280/0/1665182128980?e=2147483647&v=beta&t=GNFrug0rLyU7hiZRPzIL0p5mJ1c6caSeHwp0NIVjS0E")
    p2 = Post(
        user_id='2', 
        users=[demo,bobbie,hazel],
        post_content="I am excited to share with you that I have recently completed a new certification in ABC Company.This certification has expanded my knowledge and skills in computer science, which I am eager to apply to my work.I want to give a special thank you to DEF institution. The program was rigorous, but the instructors were knowledgeable and supportive throughout the process.", 
        post_photo="https://images.shiksha.ws/mediadata/images/articles/businessman-hand-chooses-it-wording-on-interface-screen-picture-id644048362.jpg")
    p3 = Post(
        user_id='3', 
        users=[hazel,bobbie],
        post_content="I wanted to take a moment to share my gratitude and appreciation for my amazing team at ABC company. Over the past few months, we have faced many challenges and uncertainties, but our collective dedication, resilience, and hard work have enabled us to navigate these difficult times and achieve some incredible milestones.", post_photo="https://res.cloudinary.com/sagacity/image/upload/c_crop,h_8828,w_12920,x_0,y_0/c_limit,dpr_auto,f_auto,fl_lossy,q_80,w_1080/gratitude_udyine.jpg")
    p4 = Post(
        user_id='4', 
        users=[william,demo,bobbie],
        post_content="I believe that diversity and inclusion are not just moral imperatives, but also critical for our industry's success. Diverse teams bring a range of perspectives and insights that lead to better decision-making, innovation, and problem-solving. By embracing diversity and inclusion, we can unlock the full potential of our teams and drive positive change in our industry.", post_photo="https://media.istockphoto.com/id/1288712636/vector/crowd-of-young-and-elderly-men-and-women-in-trendy-hipster-clothes-diverse-group-of-stylish.jpg?s=612x612&w=0&k=20&c=APKR2QKkQdmiNaAlU0JHm9yp9qFw-s6Uuo6hwptuHqA=")
    p5 = Post(
        user_id='5', 
        users=[eleanor,demo,bobbie,james],
        post_content="I have a confession to make - I spend more time on LinkedIn than I care to admit. In fact, I'm pretty sure I'm addicted to this platform. I mean, where else can you find such riveting content as updates on your former coworker's new job, inspirational quotes from thought leaders, and endless streams of business jargon? But in all seriousness, LinkedIn has been a valuable tool for me in my career. It's a great way to connect with like-minded professionals, learn about industry trends, and share ideas with others.", post_photo="")
    p6 = Post(
        user_id='6', 
        users=[james,bobbie],
        post_content="It is with mixed emotions that I announce that today is my last day with ABC Company. After 7 years with this incredible organization, I have decided to move on to new opportunities and challenges. I want to express my gratitude to everyone who has made my time here so memorable and rewarding. I have had the pleasure of working alongside some of the most talented and dedicated professionals in the industry, and I am grateful for the friendships and connections I have made along the way.", post_photo="https://hhsbuzzer.com/wp-content/uploads/2022/06/farewell-funny-vintage-sapience.png")
    p7 = Post(
        user_id='7', 
        users=[eleanor,ella],
        post_content="I've been thinking a lot about the value of self-promotion lately, and I've come to the conclusion that it's highly overrated. I mean, why bother with all the shameless bragging and shameless boasting, when we can just let our work speak for itself?", post_photo="https://images.squarespace-cdn.com/content/v1/58c2fee8db29d6fb17c8de4b/1504038295780-FZTGW0E60XQXBW14N9J9/megaphone+self+promotion.png?format=1000w")
    p8 = Post(
        user_id='8',
        users=[ella,bobbie],
        post_content="As I reflect on my career journey, I've come to realize that one of the most important skills we can develop as professionals is the ability to adapt and evolve with changing circumstances.At the same time, it's important to remember that adaptability is not just about staying up-to-date on the latest tools and technologies.", post_photo="https://media.istockphoto.com/id/1084115336/photo/time-for-plan-b-hand-is-turning-a-dice-and-changes-the-word-plan-a-to-plan-b.jpg?s=612x612&w=0&k=20&c=onjC22YDzkYvfHh1illsmjQXcQMC1QPH1b_0hXywRfE=")
    p9 = Post(
        user_id='9', 
        users=[charlie,bobbie,ivy],
        post_content="As much as we value our careers and professional lives, it's important to remember that family is at the core of everything we do. Our loved ones provide us with support, motivation, and a sense of purpose that goes beyond any job or title. Whether it's spending quality time with our children, supporting our parents and siblings, or simply enjoying a meal with our loved ones, family time is crucial for maintaining a healthy work-life balance and a sense of personal fulfillment.", post_photo="https://cf.ltkcdn.net/family/images/std/200821-800x533r1-family.webp")
    p10 = Post(
        user_id='10', 
        users=[demo, marnie, bobbie, tommy, eleanor, james, hazel, ellis, audrey, olive, william, charlie, ivy, ella, adrian],
        post_content="One thing I've come to realize is that success isn't just about achieving your goals; it's also about the relationships you build along the way. I feel incredibly fortunate to have worked with some amazing people who have supported and encouraged me throughout my career.", post_photo="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")

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