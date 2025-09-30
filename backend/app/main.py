import os
from flask import Flask
from .libs.db import db
from .routes.api import api_blueprint

def create_app():
    app = Flask(__name__)
    
    
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    app.register_blueprint(api_blueprint)

    return app