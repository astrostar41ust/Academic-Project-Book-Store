from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.models import db, Author
from libs.utils import requires_roles

author_bp = Blueprint("author_bp", __name__)


@author_bp.route("/", methods=["POST"])
@jwt_required()
@requires_roles("admin")
def create_author():
    data = request.get_json()

    first_name = data.get("first_name")
    last_name = data.get("last_name")

    if not all([first_name, last_name]):
        return jsonify({"msg": "Missing required fields"}), 400

    new_author = Author(first_name=first_name, last_name=last_name)
    
    try:
        db.session.add(new_author)
        db.session.commit()
        
        return jsonify(new_author.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error creating author", "error": str(e)}), 500
    
    
@author_bp.route('/<int:author_id>', methods=['DELETE'])
@jwt_required()
@requires_roles('admin')
def delete_author(author_id):
    author = db.session.get(Author, author_id)
    
    if not author:
        return jsonify({"msg": "Author not found"}), 404
    
    try:
        db.session.delete(author)
        db.session.commit()
        return jsonify({"msg": "Author deleted"}), 204
    except Exception as e:
        db.session.rollback()
    
        if 'IntegrityError' in str(e) or 'FOREIGN KEY constraint failed' in str(e):
             return jsonify({
                 "msg": "Cannot delete author: Books are still associated.",
                 "error": "Please delete or reassign the author's books first."
             }), 409 
        return jsonify({"msg": "Error deleting author", "error": str(e)}), 500
    

@author_bp.route("/", methods=["GET"])
def list_authors():
    authors = Author.query.all()
    authors_data = []
    for author in authors:
        author_dict = author.to_dict()
        author_dict['book_count'] = len(author.books)
        authors_data.append(author_dict)
    return jsonify(authors_data), 200


@author_bp.route("/<int:author_id>", methods=["GET"])
def get_author_profile(author_id):
    author = db.session.get(Author, author_id)
    
    if not author:
        return jsonify({"msg": "Author not found"}), 404
    
    books_data = [book.to_dict(include_img_url=True) for book in author.books]
    
    profile_data = author.to_dict()
    profile_data['book_count'] = len(author.books)
    profile_data['books_written'] = books_data
    
    return jsonify(profile_data), 200