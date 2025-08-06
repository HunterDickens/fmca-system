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
                            username=user_data['username'],
                            email=user_data['email'],
                            password_hash=bcrypt.generate_password_hash(user_data['password']).decode('utf-8'),
                            first_name=user_data['first_name'],
                            last_name=user_data['last_name'],
                            is_admin=user_data.get('is_admin', False),
                            company_name=user_data.get('company_name', ''),
                            phone_number=user_data.get('phone_number', ''),
                            address=user_data.get('address', '')
                        )
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
                            user_id=user.id,
                            usdot_number=filing_data['usdot_number'],
                            submission_date=datetime.strptime(filing_data['submission_date'], '%Y-%m-%d')
                        ).first()
                        
                        if not existing_filing:
                            filing = FilingHistory(
                                user_id=user.id,
                                filing_type=filing_data['filing_type'],
                                status=filing_data['status'],
                                submission_date=datetime.strptime(filing_data['submission_date'], '%Y-%m-%d'),
                                completion_date=datetime.strptime(filing_data['completion_date'], '%Y-%m-%d') if filing_data.get('completion_date') else None,
                                usdot_number=filing_data['usdot_number'],
                                carrier_name=filing_data['carrier_name'],
                                filing_data=json.dumps(filing_data.get('filing_data', {}))
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
                            user_id=user.id,
                            title=notification_data['title'],
                            message=notification_data['message']
                        ).first()
                        
                        if not existing_notification:
                            notification = Notification(
                                user_id=user.id,
                                title=notification_data['title'],
                                message=notification_data['message'],
                                type=notification_data['type'],
                                is_read=notification_data.get('is_read', False),
                                created_at=datetime.fromisoformat(notification_data['created_at'].replace('Z', '+00:00'))
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
                username='admin',
                email='admin@fmca.com',
                password_hash=bcrypt.generate_password_hash('admin123').decode('utf-8'),
                first_name='System',
                last_name='Administrator',
                is_admin=True,
                company_name='FMCA System',
                phone_number='555-0001',
                address='123 Admin St, Washington, DC 20001'
            )
            db.session.add(admin_user)
            print("Added default admin user")
        
        # Add default carrier user
        carrier_user = User.query.filter_by(email='carrier@example.com').first()
        if not carrier_user:
            carrier_user = User(
                username='carrier',
                email='carrier@example.com',
                password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'),
                first_name='John',
                last_name='Doe',
                is_admin=False,
                company_name='Example Trucking Company',
                phone_number='555-1234',
                address='456 Trucking Ave, Dallas, TX 75201'
            )
            db.session.add(carrier_user)
            print("Added default carrier user")
        
        db.session.commit()
        
        # Add sample filing for carrier user
        if carrier_user:
            sample_filing = FilingHistory.query.filter_by(user_id=carrier_user.id).first()
            if not sample_filing:
                filing = FilingHistory(
                    user_id=carrier_user.id,
                    filing_type='MCS-150',
                    status='Completed',
                    submission_date=datetime.now() - timedelta(days=30),
                    completion_date=datetime.now() - timedelta(days=28),
                    usdot_number='1234567',
                    carrier_name='Example Trucking Company',
                    filing_data=json.dumps({
                        'legal_name': 'Example Trucking Company LLC',
                        'dba': 'Example Trucking',
                        'physical_address': {
                            'street': '456 Trucking Avenue',
                            'city': 'Dallas',
                            'state': 'TX',
                            'zip': '75201'
                        },
                        'phone': '555-1234',
                        'ein': '12-3456789'
                    })
                )
                db.session.add(filing)
                print("Added sample filing")
        
        db.session.commit()
        print("Default data loaded successfully!")

if __name__ == "__main__":
    load_custom_data() 