from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, Book, Order, OrderItem
from libs.utils import requires_roles
from datetime import datetime
order_bp = Blueprint("order_bp", __name__)


@order_bp.route("/", methods=["GET"])
def list_orders():
    orders = Order.query.all()

    if not orders:
        return jsonify({"msg": "No orders found"}), 404

    return jsonify([order.to_dict() for order in orders]), 200


@order_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):

    user_id = get_jwt_identity()
    order = db.session.get(Order, order_id)

    if not order:
        return jsonify({"msg": "Order not found"}), 404
    
    if order.user_id != user_id:
        return jsonify({"msg": "Access forbidden: You can only view your own orders"}), 403

    return jsonify(order.to_dict()), 200


@order_bp.route("/", methods=["POST"])
@jwt_required()
def place_order():
    data = request.get_json()
    items = data.get("items")

    if not items:
        return jsonify({"msg": "Order must contain at least one item"}), 400

    user_id = get_jwt_identity()
    new_order = Order(user_id=user_id, total_amount=0)

    calculate_total = 0
    order_items = []

    try:
        for item in items:
            book_id = item.get("book_id")
            quantity = item.get("quantity", 1)

            if not book_id or quantity <= 0:
                return jsonify({"msg": "Invalid book ID or quantity"}), 400

            book = db.session.get(Book, book_id)
            if not book:
                return jsonify({"msg": f"Book with ID {book_id} not found"}), 404

            # Check stock availability
            if book.stock_quantity < quantity:
                return jsonify({
                    "msg": f"Insufficient stock for '{book.title}'. Available: {book.stock_quantity}, Requested: {quantity}"
                }), 400

            price = book.price
            total_amount = price * quantity
            calculate_total += total_amount

            order_item = OrderItem(
                book_id=book_id, quantity=quantity, price_at_purchase=price
            )

            order_items.append(order_item)
            
            # Reduce stock quantity
            book.stock_quantity -= quantity

        new_order.total_amount = calculate_total
        new_order.items = order_items

        db.session.add(new_order)
        db.session.commit()

        return (
            jsonify({"msg": "Order placed successfully", "order": new_order.to_dict()}),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error placing order", "error": str(e)}), 500

@order_bp.route('/admin/all', methods=['GET'])
@jwt_required()
@requires_roles('admin')
def get_all_orders_admin():

    all_orders = Order.query.order_by(Order.order_date.desc()).all()
    
    return jsonify([order.to_dict() for order in all_orders]), 200



@order_bp.route('/admin/status/<int:order_id>', methods=['PUT'])
@jwt_required()
@requires_roles('admin')
def update_order_status(order_id):
    
    data = request.get_json()
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({"msg": "New status is required"}), 400
    
    if new_status not in ['Pending', 'Completed', 'Cancelled']:
        return jsonify({"msg": "Invalid status value (Pending, Completed, Cancelled)"}), 400
    
    order = db.session.get(Order, order_id)
    
    if not order:
        return jsonify({"msg": "Order not found"}), 404
    
    try:
        order.status = new_status
        db.session.commit()
        
        return jsonify({"msg": "Order status updated", "order": order.to_dict()}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error updating order status", "error": str(e)}), 500