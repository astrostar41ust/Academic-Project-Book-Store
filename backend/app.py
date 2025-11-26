# app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import config
from models.models import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(config.Config)
   
   
    db.init_app(app)
    CORS(app)
    JWTManager(app)
   
    from routes.auth_routes import auth_bp
    from routes.book_routes import book_bp
    from routes.author_routes import author_bp
    from routes.order_routes import order_bp
    from routes.address_routes import address_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(book_bp, url_prefix='/api/books')
    app.register_blueprint(author_bp, url_prefix='/api/authors')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(address_bp, url_prefix='/api')
 
    with app.app_context():
        from models.models import Role
        db.create_all()

        if Role.query.count() == 0:
            db.session.add_all([
                Role(name='customer'),
                Role(name='admin')
            ])
            db.session.commit()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
