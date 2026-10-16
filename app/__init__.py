import os

from flask import Flask, redirect, request
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFError, CSRFProtect, generate_csrf

from .api.auth_routes import auth_routes
from .api.job_routes import job_routes
from .api.message_routes import message_routes
from .api.network_routes import network_routes
from .api.notification_routes import notification_routes
from .api.post_routes import post_routes
from .api.search_routes import search_routes
from .api.user_routes import user_routes
from .api.utils import ApiError
from .config import Config
from .models import User, db
from .seeds import seed_commands

IS_PROD = os.environ.get("FLASK_ENV") == "production"

app = Flask(__name__, static_folder="../react-app/dist", static_url_path="/")
app.config.from_object(Config)
app.url_map.strict_slashes = False
app.config["SESSION_COOKIE_SECURE"] = IS_PROD
app.config["REMEMBER_COOKIE_SECURE"] = IS_PROD

login = LoginManager(app)
login.login_view = "auth.unauthorized"


@login.user_loader
def load_user(id):
    return db.session.get(User, int(id))


@login.unauthorized_handler
def unauthorized():
    return {"message": "Please sign in to continue", "errors": {}}, 401


app.cli.add_command(seed_commands)

app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(user_routes, url_prefix="/api/users")
app.register_blueprint(network_routes, url_prefix="/api/network")
app.register_blueprint(post_routes, url_prefix="/api/posts")
app.register_blueprint(message_routes, url_prefix="/api")
app.register_blueprint(job_routes, url_prefix="/api/jobs")
app.register_blueprint(notification_routes, url_prefix="/api/notifications")
app.register_blueprint(search_routes, url_prefix="/api/search")

db.init_app(app)
Migrate(app, db)
CSRFProtect(app)


@app.errorhandler(ApiError)
def handle_api_error(err):
    return {"message": err.message, "errors": err.errors}, err.status


@app.errorhandler(CSRFError)
def handle_csrf_error(err):
    return {"message": "Your session expired. Refresh the page and try again.", "errors": {}}, 400


@app.before_request
def https_redirect():
    if IS_PROD and request.headers.get("X-Forwarded-Proto") == "http":
        return redirect(request.url.replace("http://", "https://", 1), code=301)


@app.after_request
def inject_csrf_token(response):
    # Readable by JS on purpose: the client echoes it back in the X-CSRFToken header
    # (double-submit), and CSRFProtect checks it against the signed session.
    response.set_cookie("csrf_token", generate_csrf(), secure=IS_PROD, samesite="Lax", httponly=False)
    return response


@app.route("/api/docs")
def api_help():
    """Returns all API routes and their doc strings."""
    methods = {"GET", "POST", "PUT", "PATCH", "DELETE"}
    return {
        rule.rule: [sorted(m for m in rule.methods if m in methods), app.view_functions[rule.endpoint].__doc__]
        for rule in app.url_map.iter_rules()
        if rule.endpoint != "static"
    }


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path):
    """Serve the built React app; client-side routing takes it from there."""
    if path.startswith("api/"):
        return {"message": "Not found", "errors": {}}, 404
    return app.send_static_file("index.html")


@app.errorhandler(404)
def not_found(e):
    if request.path.startswith("/api/"):
        return {"message": "Not found", "errors": {}}, 404
    return app.send_static_file("index.html")
