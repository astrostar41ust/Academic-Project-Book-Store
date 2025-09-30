from app.main import create_app
from app.libs.db import db

app = create_app()

if __name__ == '__main__':
    # This block allows us to create the database tables easily.
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)