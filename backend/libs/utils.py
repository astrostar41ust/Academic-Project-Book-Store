
from functools import wraps 
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models.models import User, db

def requires_roles(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorated_view(*args, **kwargs):
            
            # --- 1. Authentication Check (JWT Validation) ---
            try:
                # This function verifies the token, handles common errors (expired, missing), 
                # and sets the identity (user_id) for get_jwt_identity().
                verify_jwt_in_request()
            except Exception as e:
                # If JWT verification fails (e.g., token is missing or invalid)
                return jsonify(msg='Authorization token required or invalid'), 401 

            # --- 2. Authorization Check (Role Validation) ---
            
            # Get the authenticated user's ID from the token payload
            user_id = get_jwt_identity() 
            user = db.session.get(User, user_id)
            
            if not user:
                return jsonify(msg='User not found or database error'), 404
            
            # Check if the user's role name is in the allowed list of roles
            if user.role.name not in roles:
            
                return jsonify(msg=f"Access forbidden: User role '{user.role.name}' is not authorized"), 403
            
        
            return fn(*args, **kwargs)
        return decorated_view
    return wrapper