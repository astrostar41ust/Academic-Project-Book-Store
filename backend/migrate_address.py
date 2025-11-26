"""
Migration script to add Address table
Run this script to update the database schema
"""
from app import create_app
from models.models import db

def migrate():
    app = create_app()
    with app.app_context():
        # Create all tables (will only create new ones)
        db.create_all()
        print("✅ Address table created successfully!")
        print("Database migration completed.")

if __name__ == "__main__":
    migrate()
