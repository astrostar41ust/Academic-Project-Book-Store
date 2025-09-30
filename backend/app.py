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
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    with app.app_context():
        from models.models import User, Role
        db.create_all() 
        
        if Role.query.count() == 0:
            db.session.add_all([
                Role(name='customer'),
                Role(name='corporate'),
                Role(name='admin')
            ])
            db.session.commit()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)