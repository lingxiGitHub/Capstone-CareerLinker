# ---- build the React client ----
FROM node:20-alpine AS client
WORKDIR /client
COPY react-app/package.json react-app/package-lock.json ./
RUN npm ci
COPY react-app/ ./
RUN npm run build

# ---- Flask API + static client ----
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 FLASK_APP=app FLASK_ENV=production
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
COPY migrations ./migrations
COPY --from=client /client/dist ./react-app/dist
# Render/Heroku provide $PORT. Migrate on boot; run `flask seed all` once manually.
CMD flask db upgrade && exec gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 2 --threads 4 app:app
