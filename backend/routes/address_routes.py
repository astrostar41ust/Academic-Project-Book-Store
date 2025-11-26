from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, Address, User

address_bp = Blueprint("address", __name__)


@address_bp.route("/addresses", methods=["GET"])
@jwt_required()
def get_addresses():
    """Get all addresses for the current user"""
    try:
        current_user_id = get_jwt_identity()
        addresses = Address.query.filter_by(user_id=current_user_id).order_by(Address.is_default.desc(), Address.created_at.desc()).all()
        return jsonify([address.to_dict() for address in addresses]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@address_bp.route("/addresses", methods=["POST"])
@jwt_required()
def create_address():
    """Create a new address (max 3 addresses per user)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user already has 3 addresses
        address_count = Address.query.filter_by(user_id=current_user_id).count()
        if address_count >= 3:
            return jsonify({"error": "Maximum 3 addresses allowed per user"}), 400
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["label", "recipient_name", "phone_number", "address_line1", 
                          "district", "sub_district", "province", "postal_code"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # If this is the first address or is_default is True, set it as default
        is_default = data.get("is_default", False)
        if address_count == 0:
            is_default = True
        
        # If setting as default, unset other defaults
        if is_default:
            Address.query.filter_by(user_id=current_user_id, is_default=True).update({"is_default": False})
        
        # Create new address
        new_address = Address(
            user_id=current_user_id,
            label=data["label"],
            recipient_name=data["recipient_name"],
            phone_number=data["phone_number"],
            address_line1=data["address_line1"],
            address_line2=data.get("address_line2", ""),
            district=data["district"],
            sub_district=data["sub_district"],
            province=data["province"],
            postal_code=data["postal_code"],
            is_default=is_default
        )
        
        db.session.add(new_address)
        db.session.commit()
        
        return jsonify(new_address.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@address_bp.route("/addresses/<int:address_id>", methods=["GET"])
@jwt_required()
def get_address(address_id):
    """Get a specific address"""
    try:
        current_user_id = get_jwt_identity()
        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        
        if not address:
            return jsonify({"error": "Address not found"}), 404
        
        return jsonify(address.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@address_bp.route("/addresses/<int:address_id>", methods=["PUT"])
@jwt_required()
def update_address(address_id):
    """Update an address"""
    try:
        current_user_id = get_jwt_identity()
        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        
        if not address:
            return jsonify({"error": "Address not found"}), 404
        
        data = request.get_json()
        
        # Update fields
        if "label" in data:
            address.label = data["label"]
        if "recipient_name" in data:
            address.recipient_name = data["recipient_name"]
        if "phone_number" in data:
            address.phone_number = data["phone_number"]
        if "address_line1" in data:
            address.address_line1 = data["address_line1"]
        if "address_line2" in data:
            address.address_line2 = data["address_line2"]
        if "district" in data:
            address.district = data["district"]
        if "sub_district" in data:
            address.sub_district = data["sub_district"]
        if "province" in data:
            address.province = data["province"]
        if "postal_code" in data:
            address.postal_code = data["postal_code"]
        
        # Handle default address
        if "is_default" in data and data["is_default"]:
            # Unset other defaults
            Address.query.filter_by(user_id=current_user_id, is_default=True).update({"is_default": False})
            address.is_default = True
        
        db.session.commit()
        
        return jsonify(address.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@address_bp.route("/addresses/<int:address_id>", methods=["DELETE"])
@jwt_required()
def delete_address(address_id):
    """Delete an address"""
    try:
        current_user_id = get_jwt_identity()
        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        
        if not address:
            return jsonify({"error": "Address not found"}), 404
        
        was_default = address.is_default
        
        db.session.delete(address)
        db.session.commit()
        
        # If deleted address was default, set another as default
        if was_default:
            remaining_addresses = Address.query.filter_by(user_id=current_user_id).first()
            if remaining_addresses:
                remaining_addresses.is_default = True
                db.session.commit()
        
        return jsonify({"message": "Address deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@address_bp.route("/addresses/<int:address_id>/set-default", methods=["PUT"])
@jwt_required()
def set_default_address(address_id):
    """Set an address as default"""
    try:
        current_user_id = get_jwt_identity()
        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        
        if not address:
            return jsonify({"error": "Address not found"}), 404
        
        # Unset other defaults
        Address.query.filter_by(user_id=current_user_id, is_default=True).update({"is_default": False})
        
        # Set this as default
        address.is_default = True
        db.session.commit()
        
        return jsonify(address.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
