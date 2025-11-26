from flask import Blueprint, request, jsonify
from models.models import db, User, Role
from flask_jwt_extended import jwt_required
from libs.utils import requires_roles

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/", methods=["GET"])
@jwt_required()
@requires_roles("admin", "superadmin") 
def list_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@user_bp.route("/<int:user_id>/role", methods=["PUT"])
@jwt_required()
@requires_roles("superadmin")
def update_role(user_id):
    data = request.get_json()
    print("DATA RECEIVED:", data)
    role_id = data.get("role_id")
    print("ROLE ID:", role_id)

    if not role_id:
        return jsonify({"msg": "Missing role_id"}), 400

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    role = db.session.get(Role, role_id)
    if not role:
        return jsonify({"msg": "Role not found"}), 404

    user.role_id = role_id

    try:
        db.session.commit()
        return jsonify({"msg": "Role updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error updating role", "error": str(e)}), 500
