#!/usr/bin/env python3
"""
Database initialization script for FMCA application
This script will create the database tables and load demo data
"""

import os
import sys
from app import app, db
from models.user import User
from models.filinghistory import FilingHistory
from models.notification import Notification
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import json

def init_database():
    """Initialize the database with tables and demo data"""
    with app.app_context():
        # Create all tables
        print("Creating database tables...")
        db.create_all()
        
        # Initialize bcrypt
        bcrypt = Bcrypt(app)
        
        # Create demo users
        print("Creating demo users...")
        
        # Admin user
        admin_user = User(
            username="admin",
            email="admin@fmca.com",
            password_hash=bcrypt.generate_password_hash("admin123").decode('utf-8'),
            first_name="Admin",
            last_name="User",
            is_admin=True,
            company_name="FMCA Admin",
            phone_number="555-0001",
            address="123 Admin St, Admin City, AC 12345"
        )
        
        # Demo carrier user
        carrier_user = User(
            username="demo_carrier",
            email="demo@carrier.com",
            password_hash=bcrypt.generate_password_hash("demo123").decode('utf-8'),
            first_name="Demo",
            last_name="Carrier",
            is_admin=False,
            company_name="Demo Carrier Inc.",
            phone_number="555-0002",
            address="456 Carrier Ave, Demo City, DC 67890"
        )
        
        # Add users to database
        db.session.add(admin_user)
        db.session.add(carrier_user)
        db.session.commit()
        
        print(f"Created users: {admin_user.username}, {carrier_user.username}")
        
        # Create demo filing history
        print("Creating demo filing history...")
        
        filing_entries = [
            FilingHistory(
                user_id=carrier_user.id,
                filing_type="MCS-150",
                status="Completed",
                submission_date=datetime.now() - timedelta(days=30),
                completion_date=datetime.now() - timedelta(days=28),
                usdot_number="1234567",
                carrier_name="Demo Carrier Inc.",
                filing_data=json.dumps({
                    "legal_name": "Demo Carrier Inc.",
                    "dba": "Demo Carrier",
                    "physical_address": {
                        "street": "456 Carrier Ave",
                        "city": "Demo City",
                        "state": "DC",
                        "zip": "67890"
                    },
                    "phone": "555-0002",
                    "ein": "12-3456789"
                })
            ),
            FilingHistory(
                user_id=carrier_user.id,
                filing_type="MCS-150",
                status="In Progress",
                submission_date=datetime.now() - timedelta(days=5),
                usdot_number="7654321",
                carrier_name="New Carrier LLC",
                filing_data=json.dumps({
                    "legal_name": "New Carrier LLC",
                    "dba": "New Carrier",
                    "physical_address": {
                        "street": "789 New St",
                        "city": "New City",
                        "state": "NC",
                        "zip": "11111"
                    },
                    "phone": "555-0003",
                    "ein": "98-7654321"
                })
            )
        ]
        
        for filing in filing_entries:
            db.session.add(filing)
        
        # Create demo notifications
        print("Creating demo notifications...")
        
        notifications = [
            Notification(
                user_id=carrier_user.id,
                title="Filing Completed",
                message="Your MCS-150 filing for USDOT 1234567 has been completed successfully.",
                type="success",
                is_read=False,
                created_at=datetime.now() - timedelta(days=28)
            ),
            Notification(
                user_id=carrier_user.id,
                title="Filing Reminder",
                message="Your MCS-150 filing is due in 30 days. Please complete your filing.",
                type="warning",
                is_read=False,
                created_at=datetime.now() - timedelta(days=1)
            ),
            Notification(
                user_id=admin_user.id,
                title="New User Registration",
                message="A new carrier has registered: Demo Carrier Inc.",
                type="info",
                is_read=True,
                created_at=datetime.now() - timedelta(days=35)
            )
        ]
        
        for notification in notifications:
            db.session.add(notification)
        
        db.session.commit()
        
        print("Database initialization completed successfully!")
        print("\nDemo credentials:")
        print("Admin: admin@fmca.com / admin123")
        print("Carrier: demo@carrier.com / demo123")

if __name__ == "__main__":
    init_database() 