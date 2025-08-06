#!/usr/bin/env python3
"""
Script to load custom database data into the FMCA application
You can modify this script to load your specific demo data
"""

import os
import sys
import json
import csv
from app import app, db
from models.user import User
from models.filinghistory import FilingHistory
from models.notification import Notification
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta

def load_custom_data():
    """Load custom data into the database"""
    with app.app_context():
        bcrypt = Bcrypt(app)
        
        print("Loading custom data...")
        
        # Load data from JSON file
        try:
            with open('mock_data.json', 'r') as file:
                data = json.load(file)
                
                # Load users
                for user_data in data.get('users', []):
                    # Check if user already exists
                    existing_user = User.query.filter_by(email=user_data['email']).first()
                    if not existing_user:
                        user = User(
                            email=user_data['email'],
                            firstName=user_data['first_name'],
                            lastName=user_data['last_name'],
                            isAdmin=user_data.get('is_admin', False),
                            verified=True,
                            status=1
                        )
                        user.set_password(user_data['password'])
                        db.session.add(user)
                        print(f"Added user: {user_data['email']}")
                    else:
                        print(f"User already exists: {user_data['email']}")
                
                # Commit users first to get their IDs
                db.session.commit()
                
                # Load filing history
                for filing_data in data.get('filings', []):
                    user = User.query.filter_by(email=filing_data['user_email']).first()
                    if user:
                        # Check if filing already exists
                        existing_filing = FilingHistory.query.filter_by(
                            userId=user.id,
                            usdotNumber=filing_data['usdot_number']
                        ).first()
                        
                        if not existing_filing:
                            filing = FilingHistory(
                                userId=user.id,
                                usdotNumber=filing_data['usdot_number'],
                                carrierEmail=filing_data['user_email'],
                                carrierMileage='100000',
                                carrierEin=filing_data.get('filing_data', {}).get('ein', ''),
                                status=1 if filing_data['status'] == 'Completed' else 0,
                                filingPath=f"USDOT_{filing_data['usdot_number']}.pdf"
                            )
                            db.session.add(filing)
                            print(f"Added filing for: {filing_data['carrier_name']}")
                        else:
                            print(f"Filing already exists for: {filing_data['carrier_name']}")
                
                # Load notifications
                for notification_data in data.get('notifications', []):
                    user = User.query.filter_by(email=notification_data['user_email']).first()
                    if user:
                        # Check if notification already exists
                        existing_notification = Notification.query.filter_by(
                            userId=user.id,
                            title=notification_data['title'],
                            description=notification_data['message']
                        ).first()
                        
                        if not existing_notification:
                            notification = Notification(
                                userId=user.id,
                                type=notification_data['type'],
                                title=notification_data['title'],
                                description=notification_data['message'],
                                read=notification_data.get('is_read', False),
                                link='/dashboard'
                            )
                            db.session.add(notification)
                            print(f"Added notification for: {notification_data['user_email']}")
                        else:
                            print(f"Notification already exists for: {notification_data['user_email']}")
                
                db.session.commit()
                print("Custom data loaded successfully!")
                
        except FileNotFoundError:
            print("mock_data.json not found. Loading default data...")
            load_default_data()
        except Exception as e:
            print(f"Error loading data: {e}")
            load_default_data()

def load_default_data():
    """Load default data if JSON file is not available"""
    with app.app_context():
        bcrypt = Bcrypt(app)
        
        # Add default admin user
        admin_user = User.query.filter_by(email='admin@fmca.com').first()
        if not admin_user:
            admin_user = User(
                email='admin@fmca.com',
                firstName='System',
                lastName='Administrator',
                isAdmin=True,
                verified=True,
                status=1
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            print("Added default admin user")
        
        # Add default carrier user
        carrier_user = User.query.filter_by(email='carrier@example.com').first()
        if not carrier_user:
            carrier_user = User(
                email='carrier@example.com',
                firstName='John',
                lastName='Doe',
                isAdmin=False,
                verified=True,
                status=1
            )
            carrier_user.set_password('password123')
            db.session.add(carrier_user)
            print("Added default carrier user")
        
        db.session.commit()
        
        # Add sample filing for carrier user
        if carrier_user:
            sample_filing = FilingHistory.query.filter_by(userId=carrier_user.id).first()
            if not sample_filing:
                filing = FilingHistory(
                    userId=carrier_user.id,
                    usdotNumber='1234567',
                    carrierEmail='carrier@example.com',
                    carrierMileage='50000',
                    carrierEin='12-3456789',
                    status=1,
                    filingPath='USDOT_1234567.pdf'
                )
                db.session.add(filing)
                print("Added sample filing")
        
        db.session.commit()
        print("Default data loaded successfully!")

if __name__ == "__main__":
    load_custom_data() 