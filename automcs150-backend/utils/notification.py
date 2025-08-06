from models import User, Notification
from extensions import db


def add_notifications(data, userId):
    try:
        if userId is not None:
            users = User.query.filter(User.isAdmin == True, User.id != userId).all()
        else:
            users = User.query.filter(User.isAdmin == True).all()
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
        return True
    except Exception as e:
        db.session.rollback()
        # Optionally log the error: print(f"Notification error: {e}")
        return False
