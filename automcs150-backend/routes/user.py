from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from email_validator import validate_email, EmailNotValidError
from models import User, Notification
from extensions import db
from datetime import datetime, timedelta
from sqlalchemy import desc
from utils import add_notifications
import jwt
import os

user = Blueprint("user", __name__, url_prefix="/api/user")


@user.route("/get_users", methods=["GET"])
def get_users():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )
        users = (
            User.query.with_entities(
                User.id,
                User.firstName,
                User.lastName,
                User.email,
                User.isAdmin,
                User.status,
                User.created_at,
                User.lastLogin,
            )
            .filter(User.id != decoded.get("sub", ""))
            .order_by(User.created_at)
            .all()
        )
        users_list = [
            {
                "id": user.id,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "isAdmin": user.isAdmin,
                "status": user.status,
                "createdAt": user.created_at,
                "lastLogin": user.lastLogin,
            }
            for user in users
        ]
        return jsonify({"message": "Success!", "users": users_list})
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@user.route("/add_user", methods=["POST"])
def add_user():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )

        data = request.get_json()
        user_json = data.get("user", {})
        firstName = user_json.get("firstName")
        lastName = user_json.get("lastName")
        email = user_json.get("email")
        isAdmin = user_json.get("isAdmin")
        password = user_json.get("password")
        status = user_json.get("status")

        if not email or not password:
            return jsonify({"message": "Missing required fields"}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({"message": "User already exists"}), 400
        add_notifications(
            {
                "type": "user",
                "title": "New User Creation",
                "description": f"{firstName} {lastName} has created as a new user by {decoded.get('firstName', '')}",
                "read": False,
                "link": "/admin/notifications",
            },
            decoded.get("sub", ""),
        )
        user = User(
            email=email,
            firstName=firstName,
            lastName=lastName,
            isAdmin=isAdmin,
            status=status,
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "Success!"}), 200
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@user.route("/update_user", methods=["PUT"])
def update_user():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )

        data = request.get_json()
        user_json = data.get("user", {})

        id = user_json.get("id")
        user = User.query.get(id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        firstName = user_json.get("firstName")
        lastName = user_json.get("lastName")
        email = user_json.get("email")
        isAdmin = user_json.get("isAdmin")
        status = user_json.get("status")

        if user.isAdmin != isAdmin:
            add_notifications(
                {
                    "type": "user",
                    "title": "User Role Changed",
                    "description": f"{firstName} {lastName} has been assigned {'admin' if isAdmin else 'user'} role by {decoded.get('firstName', '')}",
                    "read": False,
                    "link": "/admin/notifications",
                },
                decoded.get("sub", ""),
            )
        if user.status != status:
            add_notifications(
                {
                    "type": "user",
                    "title": "User Status Changed",
                    "description": f"{firstName} {lastName} has been updated to {'Active' if status else 'Inactive'} status by {decoded.get('firstName', '')}",
                    "read": False,
                    "link": "/admin/notifications",
                },
                decoded.get("sub", ""),
            )
        if (
            user.email != email
            or user.firstName != firstName
            or user.lastName != lastName
        ):
            add_notifications(
                {
                    "type": "user",
                    "title": "User Info Changed",
                    "description": f"{firstName} {lastName}'s information has been updated by {decoded.get('firstName', '')}",
                    "read": False,
                    "link": "/admin/notifications",
                },
                decoded.get("sub", ""),
            )

        user.firstName = firstName
        user.lastName = lastName
        user.email = email
        user.isAdmin = isAdmin
        user.status = status
        user.updated_at = datetime.now()
        db.session.commit()

        return jsonify({"message": "Success!"}), 200
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@user.route("/delete_user", methods=["POST"])
def delete_user():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )

        data = request.get_json()
        user_json = data.get("user", {})

        id = user_json.get("id")
        user = User.query.get(id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        add_notifications(
            {
                "type": "user",
                "title": "User Deleteion",
                "description": f"{user.firstName} {user.lastName} has been deleted by {decoded.get('firstName', '')}",
                "read": False,
                "link": "/admin/notifications",
            },
            decoded.get("sub", ""),
        )
        
        notification = Notification.query.filter(
            Notification.userId == user.id
        ).delete()

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "Success!"}), 200
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@user.route("/reset_password", methods=["PUT"])
def reset_password():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )
        
        data = request.get_json()
        user_json = data.get("user", {})

        id = user_json.get("id")
        user = User.query.get(id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        password = user_json.get("password")
        user.set_password(password)
        user.updated_at = datetime.now()
        
        add_notifications(
            {
                "type": "user",
                "title": "User Password Updated",
                "description": f"{user.firstName} {user.lastName}'s password has been updated by {decoded.get('firstName', '')}",
                "read": False,
                "link": "/admin/notifications",
            },
            decoded.get("sub", ""),
        )

        db.session.commit()

        return jsonify({"message": "Success!"}), 200
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500
