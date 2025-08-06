from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from email_validator import validate_email, EmailNotValidError
from models import User, FilingHistory
from extensions import db
from datetime import datetime, timedelta
from sqlalchemy import desc
import jwt
import os

dashboard = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard.route("/get_stats", methods=["GET"])
def get_stats():
    try:
        activeUsers = User.query.filter(User.status == 1).count()
        totalUsers = User.query.count()
        pdfGenerated = FilingHistory.query.count()
        return jsonify(
            {
                "message": "Success!",
                "activeUsers": activeUsers,
                "totalUsers": totalUsers,
                "pdfGenerated": pdfGenerated,
            }
        )
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@dashboard.route("/get_recent_users", methods=["GET"])
def get_recent_users():
    try:
        recent_users = (
            User.query.filter(User.status == 1, User.lastLogin.isnot(None))
            .order_by(desc(User.lastLogin))
            .limit(5)
            .all()
        )
        recentUsers = [
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
            for user in recent_users
        ]
        return jsonify(
            {
                "message": "Success!",
                "recentUsers": recentUsers,
            }
        )
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500
