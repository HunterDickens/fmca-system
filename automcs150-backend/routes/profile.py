from flask import Blueprint, jsonify, request, send_from_directory
from safer import CompanySnapshot
from utils import fill_pdf_annotations
from datetime import datetime
from models import User, FilingHistory
from extensions import db
import requests
import json
import jwt
import os

profile = Blueprint("profile", __name__, url_prefix="/api/profile")
client = CompanySnapshot()


@profile.route("/get", methods=["GET"])
def get_profile():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )
        user = User.query.filter_by(id=decoded.get("sub", "")).first()
        return (
            jsonify(
                {
                    "message": "Success",
                    "profile": {
                        "email": user.email,
                        "firstName": user.firstName,
                        "lastName": user.lastName,
                    },
                }
            ),
            200,
        )
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@profile.route("/update", methods=["POST"])
def update_profile():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )
        user = User.query.filter_by(id=decoded.get("sub", "")).first()
        profile_data = request.get_json()

        user.firstName = profile_data.get("firstName", "")
        user.lastName = profile_data.get("lastName", "")
        user.email = profile_data.get("email", "")
        db.session.commit()
        return (jsonify({"message": "Success"}), 201)
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500


@profile.route("/change-password", methods=["POST"])
def update_password():
    try:
        token = request.headers.get("Authorization")
        jwt_token = token.split(" ")[1]
        decoded = jwt.decode(
            jwt_token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"]
        )
        user = User.query.filter_by(id=decoded.get("sub", "")).first()
        post_data = request.get_json()
        current_password = post_data.get("currentPassword")
        new_password = post_data.get("newPassword")

        if not user.check_password(current_password):
            return jsonify({"message": "Invalid credentials"}), 401
        user.set_password(new_password)
        db.session.commit()

        return (jsonify({"message": "Success"}), 200)
    except Exception as exception:
        return jsonify({"message": str(exception)}), 500
