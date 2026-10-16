from datetime import date, timedelta

from flask.cli import AppGroup

from app.models import (
    Comment,
    Connection,
    Conversation,
    ConversationParticipant,
    Education,
    Experience,
    Job,
    Message,
    Post,
    Reaction,
    Skill,
    User,
    db,
    environment,
    SCHEMA,
    utcnow,
)
from app.models.job import JobApplication, SavedJob

from . import data

seed_commands = AppGroup("seed")

# Children before parents so deletes don't trip foreign keys.
TABLES = [
    "messages", "conversation_participants", "conversations", "job_applications", "saved_jobs", "jobs",
    "comments", "reactions", "posts", "connections", "skills", "educations", "experiences", "users",
]


def ago(hours):
    return utcnow() - timedelta(hours=hours)


def seed_all():
    users = {}
    for key, first, last, email, headline, location, industry, photo, banner, about in data.USERS:
        users[key] = User(
            email=email, password="password", first_name=first, last_name=last, headline=headline,
            location=location, industry=industry, profile_photo=photo, banner_photo=banner, about=about,
            created_at=ago(24 * 400),
        )
    db.session.add_all(users.values())
    db.session.flush()

    for key, title, company, etype, location, start, end, desc in data.EXPERIENCES:
        db.session.add(Experience(
            user_id=users[key].id, title=title, company=company, employment_type=etype, location=location,
            start_date=date(*start, 1), end_date=date(*end, 1) if end else None, description=desc,
        ))
    for key, school, degree, field, start, end in data.EDUCATIONS:
        db.session.add(Education(
            user_id=users[key].id, school=school, degree=degree, field=field, start_year=start, end_year=end,
        ))
    for key, names in data.SKILLS.items():
        db.session.add_all(Skill(user_id=users[key].id, name=n) for n in names)

    for i, (a, b) in enumerate(data.CONNECTIONS):
        when = ago(24 * (30 + i * 7))
        db.session.add(Connection(
            requester_id=users[a].id, addressee_id=users[b].id, status="accepted",
            created_at=when, accepted_at=when + timedelta(hours=5),
        ))
    for i, (a, b, note) in enumerate(data.INVITATIONS):
        db.session.add(Connection(
            requester_id=users[a].id, addressee_id=users[b].id, message=note, created_at=ago(10 + i * 20),
        ))

    for key, hours, content, image, reactors, comments in data.POSTS:
        created = ago(hours)
        post = Post(user_id=users[key].id, content=content, image_url=image, created_at=created, updated_at=created)
        db.session.add(post)
        db.session.flush()
        for i, (rkey, kind) in enumerate(reactors):
            db.session.add(Reaction(
                user_id=users[rkey].id, post_id=post.id, type=kind,
                created_at=created + timedelta(minutes=10 + i * 7),
            ))
        for ckey, text, chours in comments:
            db.session.add(Comment(
                user_id=users[ckey].id, post_id=post.id, content=text, created_at=ago(chours), updated_at=ago(chours),
            ))

    for other, messages in data.CONVERSATIONS:
        last_at = ago(messages[-1][2])
        convo = Conversation(created_at=ago(messages[0][2]), updated_at=last_at)
        last_sender = messages[-1][0]
        convo.participants = [
            # Leave threads where the other person spoke last unread for the demo user.
            ConversationParticipant(user_id=users["demo"].id, last_read_at=last_at if last_sender == "demo" else ago(messages[0][2] + 1)),
            ConversationParticipant(user_id=users[other].id, last_read_at=last_at),
        ]
        db.session.add(convo)
        db.session.flush()
        for sender, text, hours in messages:
            db.session.add(Message(
                conversation_id=convo.id, sender_id=users[sender].id, content=text,
                created_at=ago(hours), updated_at=ago(hours),
            ))

    jobs = []
    for title, company, size, industry, location, workplace, etype, seniority, salary, days, desc in data.JOBS:
        job = Job(
            title=title, company=company, company_size=size, industry=industry, location=location,
            workplace_type=workplace, employment_type=etype, seniority=seniority, salary=salary,
            description=desc, created_at=ago(days * 24),
        )
        jobs.append(job)
    db.session.add_all(jobs)
    db.session.flush()
    # Give listings some applicant counts.
    others = [u for k, u in users.items() if k != "demo"]
    for i, job in enumerate(jobs):
        for u in others[: (i * 3) % len(others)]:
            db.session.add(JobApplication(user_id=u.id, job_id=job.id))
    db.session.add(SavedJob(user_id=users["demo"].id, job_id=jobs[1].id))

    db.session.commit()


def undo_all():
    for table in TABLES:
        if environment == "production":
            db.session.execute(db.text(f"TRUNCATE table {SCHEMA}.{table} RESTART IDENTITY CASCADE;"))
        else:
            db.session.execute(db.text(f"DELETE FROM {table}"))
    db.session.commit()


@seed_commands.command("all")
def seed():
    undo_all()
    seed_all()


@seed_commands.command("undo")
def undo():
    undo_all()
