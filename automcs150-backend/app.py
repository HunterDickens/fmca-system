from flask import Flask, render_template
from extensions import db, migrate
from dotenv import load_dotenv
from routes import register_routes
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from middleware import middleware
import os
import logging
from logging.handlers import TimedRotatingFileHandler
from datetime import datetime
import fitz
import re

if not os.path.exists("logs"):
    os.makedirs("logs")

log_filename = os.path.join('logs', datetime.now().strftime('%Y-%m-%d') + '.log')
log_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
log_handler = TimedRotatingFileHandler(
    log_filename,        # Use date-based filename
    when='midnight',     # Rotate at midnight
    interval=1,          # Rotate every day
    backupCount=7        # Keep 7 days worth of logs
)
log_handler.setFormatter(log_formatter)
log_handler.setLevel(logging.INFO)

app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    expose_headers=["Authorization"],
    allow_headers=["Authorization", "Content-Type"],
)

load_dotenv()  # Load environment variables from .env

# Handle Render's DATABASE_URL format
database_url = os.getenv("DATABASE_URL")
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url  # Load from .env
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["PROPAGATE_EXCEPTIONS"] = True

# logging
app.logger.addHandler(log_handler)

# db
db.init_app(app)
migrate.init_app(app, db)

# jwt
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# middleware(app)
register_routes(app)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(port=port, debug=False, host='0.0.0.0')
