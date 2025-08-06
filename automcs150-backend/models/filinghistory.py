from extensions import db
from datetime import datetime


class FilingHistory(db.Model):
    __tablename__ = "FilingHistory"

    id = db.Column(db.Integer, primary_key=True)
    usdotNumber = db.Column(db.String(100), nullable=False)
    carrierEmail = db.Column(db.String(255), nullable=False)
    carrierMileage = db.Column(db.String(100), nullable=True)
    carrierEin = db.Column(db.String(100))
    userId = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False)
    filingPath = db.Column(db.String(255), nullable=True)
    status = db.Column(db.Integer, default=0, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
