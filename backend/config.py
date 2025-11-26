# config.py
import datetime

class Config:
    # --- Database Settings (Using SQLite for local dev) ---
    SQLALCHEMY_DATABASE_URI = 'sqlite:///bookstore.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # --- JWT (JSON Web Token) Configuration ---
    JWT_SECRET_KEY = 'admin_secret_key' 
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=1, minutes=24)
    
    # General App Secret
    SECRET_KEY = 'admin_secret_key'