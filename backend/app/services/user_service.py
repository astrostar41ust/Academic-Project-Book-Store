from backend.app.models.models import User
from app.libs.db import db

def create_user(data):
    if not data or not 'name' in data or not 'email' in data or not 'password' in data:
        raise ValueError("Missing required user data")

    new_user = User(name=data['name'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    
    return new_user