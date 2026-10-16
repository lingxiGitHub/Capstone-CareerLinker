from flask import request


class ApiError(Exception):
    def __init__(self, message, status=400, errors=None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.errors = errors or {}


def body():
    return request.get_json(silent=True) or {}


def require_text(data, field, label, max_len, min_len=1):
    value = (data.get(field) or "").strip()
    if len(value) < min_len:
        raise ApiError(f"{label} is required", errors={field: f"{label} is required"})
    if len(value) > max_len:
        msg = f"{label} must be {max_len} characters or fewer"
        raise ApiError(msg, errors={field: msg})
    return value


def optional_text(data, field, max_len):
    value = (data.get(field) or "").strip()
    if len(value) > max_len:
        raise ApiError(f"{field} must be {max_len} characters or fewer", errors={field: "Too long"})
    return value or None


def get_or_404(model, ident, label):
    from app.models import db

    obj = db.session.get(model, ident)
    if obj is None:
        raise ApiError(f"{label} not found", 404)
    return obj


def forbid_unless(condition):
    if not condition:
        raise ApiError("You don't have permission to do that", 403)


def pagination(default_limit=10, max_limit=50):
    try:
        offset = max(int(request.args.get("offset", 0)), 0)
        limit = min(max(int(request.args.get("limit", default_limit)), 1), max_limit)
    except ValueError:
        raise ApiError("Invalid pagination parameters")
    return offset, limit
