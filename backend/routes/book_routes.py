from flask import Blueprint, request, jsonify
from flask_jwt_extended import  jwt_required
from models.models import db, Book, Author
from libs.utils import requires_roles
from datetime import datetime

book_bp = Blueprint('book_bp', __name__)

@book_bp.route('/', methods=['GET'])
def list_books():
    books = Book.query.all()
    return jsonify([book.to_dict(include_img_url=True) for book in books]), 200

@book_bp.route('/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = db.session.get(Book, book_id)
    
    if not book:
        return jsonify({"msg": "Book not found"}), 404
    
    return jsonify(book.to_dict(include_img_url=True)), 200


@book_bp.route('/', methods=['POST'])
@jwt_required()
@requires_roles("admin", "superadmin") 
def create_book():
    data = request.get_json()
    
    required_fields = ['title', 'price', 'file_url', 'img_url']
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Missing required fields"}), 400
    
    authors = Author.query.filter(Author.id.in_(data.get('author_ids', []))).all()
    if 'author_ids' in data and len(authors) != len(data['author_ids']):
        return jsonify({"msg": "One or more authors not found"}), 404
    
    # Convert publication_date string to date object
    publication_date = None
    if data.get('publication_date'):
        try:
            publication_date = datetime.strptime(data['publication_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD"}), 400
    
    new_book = Book(
        title=data['title'],
        price=data['price'],
        file_url=data.get('file_url'),
        img_url=data.get('img_url'),
        stock_quantity=data.get('stock_quantity', 0),
        publication_date=publication_date,
        authors=authors
    )
    
    try:
        db.session.add(new_book)
        db.session.commit()
        
        return jsonify(new_book.to_dict(include_file_url=True,include_img_url=True)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error creating book", "error": str(e)}), 500
    
@book_bp.route('/<int:book_id>', methods=['PUT'])
@jwt_required()
@requires_roles("admin", "superadmin") 
def update_book(book_id):
    book = db.session.get(Book, book_id)
    
    if not book:
        return jsonify({"msg": "Book not found"}), 404
    
    data = request.get_json()
    
    book.title = data.get('title', book.title)
    book.price = data.get('price', book.price)
    book.file_url = data.get('file_url', book.file_url)
    book.img_url = data.get('img_url', book.img_url)
    book.stock_quantity = data.get('stock_quantity', book.stock_quantity)
    
    # Convert publication_date string to date object
    if 'publication_date' in data:
        try:
            book.publication_date = datetime.strptime(data['publication_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD"}), 400
    
    if 'author_ids' in data:
        authors = Author.query.filter(Author.id.in_(data['author_ids'])).all()
        if len(authors) != len(data['author_ids']):
            return jsonify({"msg": "One or more authors not found"}), 404
        book.authors = authors
    
    try: 
        db.session.commit()
        return jsonify(book.to_dict(include_file_url=True)), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error updating book", "error": str(e)}), 500
    
@book_bp.route('/<int:book_id>', methods=['DELETE'])
@jwt_required()
@requires_roles("admin", "superadmin") 
def delete_book(book_id):
    book = db.session.get(Book, book_id)
    
    if not book:
        return jsonify({"msg": "Book not found"}), 404
    
    try:
        db.session.delete(book)
        db.session.commit()
        return jsonify({"msg": "Book deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error deleting book", "error": str(e)}), 500