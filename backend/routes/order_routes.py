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
def get_order(order_id):

    order = db.session.get(Order, order_id)

    if not order:
        return jsonify({"msg": "Order not found"}), 404

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

            price = book.price
            total_amount = price * quantity
            calculate_total += total_amount

            order_item = OrderItem(
                book_id=book_id, quantity=quantity, price_at_purchase=price
            )

            order_items.append(order_item)

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
