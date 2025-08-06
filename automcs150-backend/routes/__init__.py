from flask import Flask
from routes.filing import filing
from routes.profile import profile
from routes.auth import auth
from routes.user import user
from routes.dashboard import dashboard
from routes.notification import notification


def register_routes(app):
    app.register_blueprint(filing)
    app.register_blueprint(profile)
    app.register_blueprint(auth)
    app.register_blueprint(user)
    app.register_blueprint(dashboard)
    app.register_blueprint(notification)
