from flask import Blueprint, request, jsonify
from flask_jwt_extended import  create_access_token, jwt_required, get_jwt_identity
from models.models import db, User, Role


auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"msg": "Missing required fields"}), 400
    
    customer_role = Role.query.filter_by(name='customer').first()
    if not customer_role:
        return jsonify(msg="System error: Default role not found"), 500
    
    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return jsonify({"msg": "User already exists"}), 400