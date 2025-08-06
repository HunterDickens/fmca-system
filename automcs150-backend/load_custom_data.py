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
        
        # Example: Load users from a CSV file
        # Uncomment and modify the following code to load your data
        
        """
        # Load users from CSV
        with open('your_users.csv', 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                user = User(
                    username=row['username'],
                    email=row['email'],
                    password_hash=bcrypt.generate_password_hash(row['password']).decode('utf-8'),
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    is_admin=row['is_admin'].lower() == 'true',
                    company_name=row['company_name'],
                    phone_number=row['phone_number'],
                    address=row['address']
                )
                db.session.add(user)
        
        # Load filing history from CSV
        with open('your_filings.csv', 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                filing = FilingHistory(
                    user_id=row['user_id'],
                    filing_type=row['filing_type'],
                    status=row['status'],
                    submission_date=datetime.strptime(row['submission_date'], '%Y-%m-%d'),
                    usdot_number=row['usdot_number'],
                    carrier_name=row['carrier_name'],
                    filing_data=row['filing_data']
                )
                db.session.add(filing)
        """
        
        # Example: Load data from JSON file
        # Uncomment and modify the following code to load your JSON data
        
        """
        with open('your_data.json', 'r') as file:
            data = json.load(file)
            
            # Load users
            for user_data in data.get('users', []):
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
            
            # Load filing history
            for filing_data in data.get('filings', []):
                filing = FilingHistory(
                    user_id=filing_data['user_id'],
                    filing_type=filing_data['filing_type'],
                    status=filing_data['status'],
                    submission_date=datetime.strptime(filing_data['submission_date'], '%Y-%m-%d'),
                    usdot_number=filing_data['usdot_number'],
                    carrier_name=filing_data['carrier_name'],
                    filing_data=json.dumps(filing_data.get('filing_data', {}))
                )
                db.session.add(filing)
        """
        
        # Example: Load data directly in the script
        # Modify this section to add your specific demo data
        
        # Add your custom users here
        custom_users = [
            {
                'username': 'your_carrier1',
                'email': 'carrier1@example.com',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Doe',
                'is_admin': False,
                'company_name': 'Your Carrier Company',
                'phone_number': '555-1234',
                'address': '123 Main St, City, State 12345'
            }
            # Add more users as needed
        ]
        
        for user_data in custom_users:
            # Check if user already exists
            existing_user = User.query.filter_by(email=user_data['email']).first()
            if not existing_user:
                user = User(
                    username=user_data['username'],
                    email=user_data['email'],
                    password_hash=bcrypt.generate_password_hash(user_data['password']).decode('utf-8'),
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    is_admin=user_data['is_admin'],
                    company_name=user_data['company_name'],
                    phone_number=user_data['phone_number'],
                    address=user_data['address']
                )
                db.session.add(user)
                print(f"Added user: {user_data['email']}")
        
        # Add your custom filing history here
        custom_filings = [
            {
                'user_email': 'carrier1@example.com',
                'filing_type': 'MCS-150',
                'status': 'Completed',
                'submission_date': datetime.now() - timedelta(days=60),
                'completion_date': datetime.now() - timedelta(days=58),
                'usdot_number': '1234567',
                'carrier_name': 'Your Carrier Company',
                'filing_data': {
                    'legal_name': 'Your Carrier Company',
                    'dba': 'Your Carrier',
                    'physical_address': {
                        'street': '123 Main St',
                        'city': 'City',
                        'state': 'ST',
                        'zip': '12345'
                    },
                    'phone': '555-1234',
                    'ein': '12-3456789'
                }
            }
            # Add more filings as needed
        ]
        
        for filing_data in custom_filings:
            user = User.query.filter_by(email=filing_data['user_email']).first()
            if user:
                filing = FilingHistory(
                    user_id=user.id,
                    filing_type=filing_data['filing_type'],
                    status=filing_data['status'],
                    submission_date=filing_data['submission_date'],
                    completion_date=filing_data.get('completion_date'),
                    usdot_number=filing_data['usdot_number'],
                    carrier_name=filing_data['carrier_name'],
                    filing_data=json.dumps(filing_data['filing_data'])
                )
                db.session.add(filing)
                print(f"Added filing for: {filing_data['carrier_name']}")
        
        db.session.commit()
        print("Custom data loaded successfully!")

if __name__ == "__main__":
    load_custom_data() 