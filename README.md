# CareerLinker

A LinkedIn-inspired professional network built with React and Flask.

**Live site:** https://linkedling.onrender.com (demo login: `demo@careerlinker.io` / `password`)

## Features

- **Feed:** posts with images, six reaction types, and comments
- **Profiles:** about, experience, education and skills
- **My Network:** connection requests and people you may know
- **Messaging:** one-on-one conversations
- **Jobs:** search, save, and Easy Apply
- **Notifications** and global **search**

## Tech

React 18, Redux Toolkit Query, React Router, Vite · Flask, SQLAlchemy, PostgreSQL

## Run locally

Requires Python 3.11+ and Node 20+.

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask db upgrade && flask seed all
flask run --port 5001
```

In a second terminal:

```bash
cd react-app && npm install && npm run dev
```

Open http://localhost:3000.

## Contact

lingxi1023@gmail.com
