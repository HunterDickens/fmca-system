from flask import Blueprint, jsonify, request, send_from_directory
from safer import CompanySnapshot
from utils import fill_pdf_annotations
from datetime import datetime
from models import User, Notification
from extensions import db
import requests
import json
import jwt
import os

notification = Blueprint("notification", __name__, url_prefix="/api/notification")
client = CompanySnapshot()


@notification.route("/get", methods=["GET"])
def get_notifications():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )
        notifications = Notification.query.filter_by(
            userId=decoded.get("sub", "")
        ).all()
        unread_count = Notification.query.filter_by(
            read=False, userId=decoded.get("sub", "")
        ).count()
        notification_list = [
            {
                "id": notification.id,
                "type": notification.type,
                "title": notification.title,
                "description": notification.description,
                "read": notification.read,
                "link": notification.link,
                "time": notification.created_at,
            }
            for notification in notifications
        ]
        return (
            jsonify(
                {
                    "message": "Success",
                    "notifications": notification_list,
                    "unread_count": unread_count,
                }
            ),
            200,
        )
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@notification.route("/add", methods=["POST"])
def add_notification():
    try:
        data = request.get_json()
        users = User.query.filter_by(isAdmin=True).all()
        for user in users:
            notification = Notification(
                userId=user.id,
                type=data.get("type"),
                title=data.get("title"),
                description=data.get("description"),
                read=data.get("read", False),
                link=data.get("link", ""),
            )
            db.session.add(notification)
        db.session.commit()
        return (jsonify({"message": "Success"}), 201)
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@notification.route("/mark_read", methods=["POST"])
def markRead_notification():
    try:
        data = request.get_json()
        notification = Notification.query.filter_by(id=data.get("id", "")).first()
        notification.read = True
        db.session.commit()
        return (jsonify({"message": "Success"}), 201)
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@notification.route("/mark_all_read", methods=["GET"])
def markAllRead_notification():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )
        notification = Notification.query.filter(
            Notification.userId == decoded.get("sub", "")
        ).update({"read": True})
        db.session.commit()

        return (jsonify({"message": "Success"}), 201)
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@notification.route("/dismiss", methods=["POST"])
def dismiss_notification():
    try:
        data = request.get_json()
        notification = Notification.query.filter_by(id=data.get("id", "")).first()
        db.session.delete(notification)
        db.session.commit()
        return (jsonify({"message": "Success"}), 201)
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500

@notification.route("/dismiss_all", methods=["GET"])
def dismiss_all_notifications():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )
        notifications = Notification.query.filter_by(
            userId=decoded.get("sub", "")
        ).all()
        for notification in notifications:
            db.session.delete(notification)
        db.session.commit()
        return (jsonify({"message": "Success"}), 201)
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500