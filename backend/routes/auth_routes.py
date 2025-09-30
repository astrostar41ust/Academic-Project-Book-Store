from flask import Blueprint, request, jsonify
from flask_jwt_extended import  create_access_token, jwt_required, get_jwt_identity
from models.models import db, User, Role


auth_bp = Blueprint('auth_bp', __name__)

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
    
    
    new_user = User(username=username, email=email, role_id=customer_role.id)
    new_user.set_password(password)
    
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        response_data = {
            "msg": "User registered successfully",
            "user": new_user.to_dict()
        }
        return jsonify(response_data), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Registration failed", "error": str(e)}), 500
    
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    
    return jsonify({"msg": "Invalid credentials"}), 401


        