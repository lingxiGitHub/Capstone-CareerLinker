"""create table

Revision ID: e21a2d0f4191
Revises: 
Create Date: 2023-02-28 21:50:26.839729

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'e21a2d0f4191'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('conversations',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('created_at', sa.DateTime(), server_default=sa.text(
                        '(CURRENT_TIMESTAMP)'), nullable=False),
                    sa.Column('updated_at', sa.DateTime(), server_default=sa.text(
                        '(CURRENT_TIMESTAMP)'), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )

    if environment == "production":
        op.execute(f"ALTER TABLE conversations SET SCHEMA {SCHEMA};")

    op.create_table('users',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('username', sa.String(
                        length=40), nullable=False),
                    sa.Column('email', sa.String(length=255), nullable=False),
                    sa.Column('hashed_password', sa.String(
                        length=255), nullable=False),
                    sa.Column('first_name', sa.String(
                        length=50), nullable=False),
                    sa.Column('last_name', sa.String(
                        length=50), nullable=False),
                    sa.Column('profile_photo', sa.String(
                        length=500), nullable=True),
                    sa.Column('title', sa.String(length=100), nullable=True),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint('email'),
                    sa.UniqueConstraint('username')
                    )

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")

    op.create_table('messages',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('conversation_id', sa.Integer(), nullable=False),
                    sa.Column('message_content', sa.String(
                        length=1000), nullable=False),
                    sa.Column('created_at', sa.DateTime(), server_default=sa.text(
                        '(CURRENT_TIMESTAMP)'), nullable=False),
                    sa.Column('updated_at', sa.DateTime(), server_default=sa.text(
                        '(CURRENT_TIMESTAMP)'), nullable=False),
                    sa.ForeignKeyConstraint(['conversation_id'], [
                                            'conversations.id'], ),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
                    sa.PrimaryKeyConstraint('id')
                    )

    if environment == "production":
        op.execute(f"ALTER TABLE messages SET SCHEMA {SCHEMA};")

    op.create_table('posts',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('post_content', sa.String(
                        length=1000), nullable=False),
                    sa.Column('post_photo', sa.String(
                        length=1000), nullable=True),
                    sa.Column('created_at', sa.DateTime(), server_default=sa.text(
                        '(CURRENT_TIMESTAMP)'), nullable=False),
                    sa.Column('updated_at', sa.DateTime(), server_default=sa.text(
                        '(CURRENT_TIMESTAMP)'), nullable=False),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
                    sa.PrimaryKeyConstraint('id')
                    )

    if environment == "production":
        op.execute(f"ALTER TABLE posts SET SCHEMA {SCHEMA};")

    op.create_table('user_conversations',
                    sa.Column('users', sa.Integer(), nullable=False),
                    sa.Column('conversations', sa.Integer(), nullable=False),
                    sa.ForeignKeyConstraint(
                        ['conversations'], ['conversations.id'], ),
                    sa.ForeignKeyConstraint(['users'], ['users.id'], ),
                    sa.PrimaryKeyConstraint('users', 'conversations')
                    )

    if environment == "production":
        op.execute(f"ALTER TABLE user_conversations SET SCHEMA {SCHEMA};")

    op.create_table('comments',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('post_id', sa.Integer(), nullable=False),
                    sa.Column('comment_content', sa.String(
                        length=500), nullable=False),
                    sa.Column('created_at', sa.DateTime(), server_default=sa.text(
                        '(CURRENT_TIMESTAMP)'), nullable=False),
                    sa.Column('updated_at', sa.DateTime(), server_default=sa.text(
                        '(CURRENT_TIMESTAMP)'), nullable=False),
                    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
                    sa.PrimaryKeyConstraint('id')
                    )

    if environment == "production":
        op.execute(f"ALTER TABLE comments SET SCHEMA {SCHEMA};")

    op.create_table('likes',
                    sa.Column('users', sa.Integer(), nullable=False),
                    sa.Column('posts', sa.Integer(), nullable=False),
                    sa.ForeignKeyConstraint(['posts'], ['posts.id'], ),
                    sa.ForeignKeyConstraint(['users'], ['users.id'], ),
                    sa.PrimaryKeyConstraint('users', 'posts')
                    )
    if environment == "production":
        op.execute(f"ALTER TABLE likes SET SCHEMA {SCHEMA};")


    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('likes')
    op.drop_table('comments')
    op.drop_table('user_conversations')
    op.drop_table('posts')
    op.drop_table('messages')
    op.drop_table('users')
    op.drop_table('conversations')
    # ### end Alembic commands ###