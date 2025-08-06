# middleware.py
from flask import request, jsonify
import jwt
import flask

EXEMPT_ROUTES = ["/api/auth/login", "/api/auth/register"]


def middleware(app):
    @app.before_request
    def check_jwt_token():
        if request.path in EXEMPT_ROUTES:
            return

        token = request.headers.get("Authorization")
        print(request.headers)
        if token is None or not token.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401

        try:
            jwt_token = token.split(" ")[1]
            decoded = jwt.decode(
                jwt_token, app.config["JWT_SECRET_KEY"], algorithms=["HS256"]
            )
            request.user = decoded
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
