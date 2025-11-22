"""
Migration script to add is_recommended column to Book table
Run this script after updating the models.py file
"""

from app import create_app
from models.models import db, Book

def add_is_recommended_column():
    app = create_app()
    with app.app_context():
        try:
            # Try to add the column if it doesn't exist
            with db.engine.connect() as conn:
                # Check if column exists
                result = conn.execute(db.text("PRAGMA table_info(book)"))
                columns = [row[1] for row in result]
                
                if 'is_recommended' not in columns:
                    print("Adding is_recommended column...")
                    conn.execute(db.text("ALTER TABLE book ADD COLUMN is_recommended BOOLEAN DEFAULT 0 NOT NULL"))
                    conn.commit()
                    print("✅ Successfully added is_recommended column!")
                else:
                    print("ℹ️ Column is_recommended already exists")
                
                # Optionally, set some books as recommended for testing
                print("\nSetting first 3 books as recommended for testing...")
                books = Book.query.limit(3).all()
                for book in books:
                    book.is_recommended = True
                db.session.commit()
                print(f"✅ Set {len(books)} books as recommended")
                
        except Exception as e:
            print(f"❌ Error: {e}")
            db.session.rollback()

if __name__ == '__main__':
    add_is_recommended_column()
