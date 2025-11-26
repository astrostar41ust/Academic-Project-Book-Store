from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    users = db.relationship("User", backref="role", lazy=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role_id = db.Column(db.Integer, db.ForeignKey("role.id"), nullable=False)

    orders = db.relationship("Order", backref="customer", lazy=True)
    addresses = db.relationship("Address", backref="user", lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": {
                "id": self.role.id,
                "name": self.role.name,
            }
        }


class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    label = db.Column(db.String(50), nullable=False)  # e.g., "Home", "Work", "Other"
    recipient_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    address_line1 = db.Column(db.String(255), nullable=False)
    address_line2 = db.Column(db.String(255), nullable=True)
    district = db.Column(db.String(100), nullable=False)  # District
    sub_district = db.Column(db.String(100), nullable=False)  # Sub-district
    province = db.Column(db.String(100), nullable=False)  # Province
    postal_code = db.Column(db.String(10), nullable=False)
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "label": self.label,
            "recipient_name": self.recipient_name,
            "phone_number": self.phone_number,
            "address_line1": self.address_line1,
            "address_line2": self.address_line2,
            "district": self.district,
            "sub_district": self.sub_district,
            "province": self.province,
            "postal_code": self.postal_code,
            "is_default": self.is_default,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


book_author_association = db.Table(
    "book_author",
    db.Column("book_id", db.Integer, db.ForeignKey("book.id"), primary_key=True),
    db.Column("author_id", db.Integer, db.ForeignKey("author.id"), primary_key=True),
)


class Author(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255))
    
    books = db.relationship(
        "Book",
        secondary=book_author_association,
        back_populates="authors"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "name": f"{self.first_name} {self.last_name}",
            "image_url": self.image_url
        }


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    
    # Inventory management
    stock_quantity = db.Column(db.Integer, default=0, nullable=False)
    publication_date = db.Column(db.Date, nullable=True)
    
    # Recommendation flag
    is_recommended = db.Column(db.Boolean, default=False, nullable=False)

    file_url = db.Column(db.String(512), nullable=True)
    img_url = db.Column(db.String(512), nullable=True)

    authors = db.relationship(
        "Author", secondary=book_author_association, back_populates="books"
    )
    order_items = db.relationship("OrderItem", backref="book", lazy=True)

    def to_dict(self, include_file_url=False, include_img_url=False):
        data = {
            "id": self.id,
            "title": self.title,
            "price": self.price,
            "stock_quantity": self.stock_quantity,
            "publication_date": self.publication_date.isoformat() if self.publication_date else None,
            "is_recommended": self.is_recommended,
            "authors": [a.to_dict() for a in self.authors],
        }
        if include_file_url:
            data["file_url"] = self.file_url
    
        if include_img_url:
            data["img_url"] = self.img_url
        return data
        

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Float, nullable=False)

    status = db.Column(db.String(50), default="Pending")

    items = db.relationship("OrderItem", backref="order", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "order_date": self.order_date.isoformat(),
            "total_amount": self.total_amount,
            "status": self.status,
            "items": [item.to_dict() for item in self.items],
        }


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("book.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price_at_purchase = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "book": self.book.title,
            "price_at_purchase": self.price_at_purchase,
        }
