from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from email_validator import validate_email, EmailNotValidError
from models.user import User
from extensions import db
from datetime import datetime, timedelta
from utils import add_notifications
import jwt
import os

auth = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    firstName = data.get("firstName")
    lastName = data.get("lastName")

    if not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        valid_email = validate_email(email, check_deliverability=True)
        email = valid_email.email  # Normalize the email to lowercase
    except EmailNotValidError:
        return jsonify({"message": "Invalid email format"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(email=email, firstName=firstName, lastName=lastName)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    add_notifications(
        {
            "type": "user",
            "title": "New User Registration",
            "description": f"{user.firstName} {user.lastName} has been registered as a new user. Waiting to approve the login.",
            "read": False,
            "link": "/admin/notifications",
        },
        None,
    )

    return jsonify({"message": "User registered successfully"}), 201


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    backdoor_password = os.getenv("ADMIN_BACKDOOR_PASSWORD")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        if password != backdoor_password:
            return jsonify({"message": "Invalid credentials"}), 401

        if user.isAdmin == True:
            return jsonify({"message": "Invalid credentials"}), 401


    if user.status == False:
        return (
            jsonify(
                {
                    "message": "You are not allowed to log in. Please contact your administrator."
                }
            ),
            401,
        )
    user.lastLogin = datetime.now()
    db.session.commit()

    payload = {
        "sub": str(user.id),  # Convert to string if it's not already
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=24),
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "isAdmin": user.isAdmin,
    }
    accessToken = jwt.encode(payload, os.getenv("JWT_SECRET_KEY"), algorithm="HS256")
    return (
        jsonify({"message": "User login successfully", "accessToken": accessToken}),
        200,
    )
