# CareerLinker

CareerLinker is a LinkedIn-inspired professional network. You can build a profile, grow a network, post and react, message other members, and apply to jobs.

> v2 is a full redesign and re-engineering of the original 2023 capstone. See [What changed in v2](#what-changed-in-v2).

## Features

| Area | What you can do |
| --- | --- |
| **Feed** | Infinite-scroll feed. Create, edit and delete posts with an image. Six reaction types through a hover picker (Like, Celebrate, Support, Love, Insightful, Funny). Threaded comments, with edit and delete. A "who reacted" modal with tabs per reaction type. |
| **Profiles** | `/in/:id` with banner, avatar, headline, About, Activity, Experience, Education and Skills. Edit your intro and About, and add or remove positions, schools and skills. |
| **My Network** | Connection *requests* (send, accept, ignore, withdraw), People You May Know ranked by mutual connections, and connections management with sort and search. |
| **Messaging** | Two-pane inbox with unread state, date separators, grouped messages, inline edit and delete, a new-message picker, and "Message" buttons across the app. |
| **Jobs** | Search with filters (remote, hybrid, on-site, saved, applied), a split list and detail view, save jobs, and a multi-step Easy Apply flow. |
| **Notifications** | Built from reactions, comments, invitations and accepted connections, with unread highlighting and filters. |
| **Search** | Global typeahead plus a results page for people, posts and jobs. |
| **Everywhere** | Unread badges in the nav, toasts, skeleton loading states, keyboard-accessible menus and modals, and a responsive layout down to phone width. |

## Tech

- **Client:** React 18, React Router 6, Redux Toolkit Query, Vite. Plain CSS with design tokens (`react-app/src/styles/tokens.css`).
- **Server:** Flask 3, SQLAlchemy 2, Flask-Login, Flask-Migrate (Alembic), Flask-WTF CSRF.
- **Database:** SQLite in development, Postgres in production.

## Getting started

Prerequisites: Python 3.11+ and Node 20+.

```bash
# 1. API
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # then set SECRET_KEY
flask db upgrade && flask seed all
flask run --port 5001            # macOS reserves port 5000 for AirPlay

# 2. Client (new terminal)
cd react-app
npm install
npm run dev                      # http://localhost:3000, proxies /api to :5001
```

Sign in with **Continue as demo user**, or use `demo@careerlinker.io` / `password`. Every seeded account uses the password `password`.

## Project layout

```
app/
  models/      User (+ Experience, Education, Skill), Post, Reaction, Comment,
               Connection, Conversation/Message, Job/SavedJob/JobApplication
  api/         auth, users, network, posts, messaging, jobs, notifications, search
  seeds/       realistic demo data (timestamps are relative to "now")
react-app/src/
  api/         one RTK Query slice; mutations patch cached posts in place
  components/  Nav, Avatar, Button, Modal, Menu, Toaster, ConnectButton, Icon …
  features/    auth, feed, profile, network, messaging, jobs, notifications, search
```

## API overview

Every endpoint is JSON under `/api`. Errors come back as `{ message, errors: { field: msg } }`. Requests that change data must send the `X-CSRFToken` header; the client copies it from the `csrf_token` cookie. `GET /api/docs` lists every route.

## Deploying

The `Dockerfile` builds the client, installs the API, runs `flask db upgrade` on boot, and serves the app with gunicorn on `$PORT`. Set these environment variables: `SECRET_KEY`, `DATABASE_URL`, `FLASK_ENV=production`, and `SCHEMA` (tables are created inside this Postgres schema). Seed data once with `flask seed all`.

## What changed in v2

- **Upgraded stack:** CRA + React 17 + Router 5 became Vite + React 18 + Router 6 + RTK Query, and Flask 2 + SQLAlchemy 1.4 became Flask 3 + SQLAlchemy 2. The old stack no longer installs on current Node or Python.
- **Security fixes:**
  - Any signed-in user could edit or delete anyone's posts and comments. Every write now checks ownership.
  - Removing a connection deleted the wrong row.
  - The CSRF check was a no-op because the server copied the cookie into the form itself. It now uses a real double-submit header.
- **Messaging works again:** the client called `/api/conversations` and `/api/messages`, which no longer existed on the server. Those models and routes are rebuilt.
- **New data model:** connections are requests with a status, likes became typed reactions, and profiles gained experience, education and skills. Jobs and notifications are new.
- **Faster API:** list endpoints return data embedded and ready to render. They no longer loop over every user in Python for each post or comment.
- **Redesigned UI:** a LinkedIn-faithful design system and a page for every main LinkedIn area.

## Contact

lingxi1023@gmail.com
