from flask import Blueprint, jsonify
from extensions import db
import os
from datetime import datetime

health = Blueprint('health', __name__)

@health.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Test database connection
        db.session.execute('SELECT 1')
        db_status = 'healthy'
    except Exception as e:
        db_status = f'unhealthy: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'database': db_status,
        'environment': os.getenv('FLASK_ENV', 'development'),
        'version': '1.0.0'
    })

@health.route('/health/detailed', methods=['GET'])
def detailed_health_check():
    """Detailed health check with more information"""
    try:
        # Test database connection
        db.session.execute('SELECT 1')
        db_status = 'healthy'
        db_error = None
    except Exception as e:
        db_status = 'unhealthy'
        db_error = str(e)
    
    # Check environment variables
    env_vars = {
        'DATABASE_URL': 'set' if os.getenv('DATABASE_URL') else 'not_set',
        'JWT_SECRET_KEY': 'set' if os.getenv('JWT_SECRET_KEY') else 'not_set',
        'FLASK_ENV': os.getenv('FLASK_ENV', 'development')
    }
    
    return jsonify({
        'status': 'healthy' if db_status == 'healthy' else 'unhealthy',
        'timestamp': datetime.utcnow().isoformat(),
        'database': {
            'status': db_status,
            'error': db_error
        },
        'environment_variables': env_vars,
        'version': '1.0.0',
        'service': 'FMCA Backend API'
    }) 