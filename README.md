# 📚 Academic Project: BookStore Management System

A comprehensive full-stack web application for managing an online bookstore with three-tier architecture: Customer Frontend, Admin Dashboard, and Backend API. Features include user authentication, book inventory management, author management, order processing, and address management.

## 🚀 Tech Stack

### Backend
- **Framework:** Flask 3.1.2 (Python)
- **Database:** SQLite with SQLAlchemy 2.0.43 ORM
- **Authentication:** JWT (Flask-JWT-Extended 4.7.1)
- **CORS:** Flask-CORS 6.0.1
- **Security:** Werkzeug password hashing

### Frontend (Customer Portal)
- **Framework:** React 19.1.1 + TypeScript 5.8.3
- **Build Tool:** Vite 7.1.7
- **UI Library:** HeroUI 2.8.5
- **Styling:** Tailwind CSS 4.1.14
- **HTTP Client:** Axios 1.12.2
- **Routing:** React Router DOM 7.9.3
- **Icons:** React Icons 5.5.0 + Iconify 6.0.2
- **State Management:** Context API + Custom Hooks

### Admin Dashboard
- **Framework:** React 19.1.1 + TypeScript 5.9.3
- **Build Tool:** Vite 7.1.7
- **UI Library:** HeroUI 2.8.5 + Radix UI
- **Styling:** Tailwind CSS 4.1.14
- **HTTP Client:** Axios 1.13.2
- **Routing:** React Router DOM 6.30.1
- **Notifications:** React Toastify 11.0.5 + SweetAlert2 11.26.3
- **JWT:** jwt-decode 4.0.0

### DevOps
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **Tunneling:** Ngrok (for public access)

## 🏗️ Project Structure

```
📦 Academic-Project-Book-Store/
├── 🔧 backend/                    # Flask REST API Server
│   ├── app.py                     # Main Flask application
│   ├── config.py                  # Database & JWT configuration
│   ├── requirements.txt           # Python dependencies
│   ├── Dockerfile                 # Backend containerization
│   ├── instance/
│   │   └── bookstore.db          # SQLite database
│   ├── models/
│   │   └── models.py             # Database models (User, Book, Author, Order, Address)
│   ├── routes/
│   │   ├── auth_routes.py        # Authentication endpoints
│   │   ├── book_routes.py        # Book CRUD + inventory management
│   │   ├── author_routes.py      # Author CRUD operations
│   │   ├── order_routes.py       # Order processing & admin orders
│   │   ├── user_routes.py        # User management (admin only)
│   │   └── address_routes.py     # User address management
│   ├── libs/
│   │   └── utils.py              # Role-based access decorators
│   └── migrate_*.py              # Database migration scripts
│
├── 🎨 frontend/                   # Customer Web Application
│   ├── Dockerfile                 # Frontend containerization
│   ├── nginx.conf                # Frontend Nginx config
│   ├── package.json              # Dependencies
│   ├── vite.config.ts            # Vite configuration
│   └── src/
│       ├── App.tsx               # Root component with routing
│       ├── main.tsx              # Entry point
│       ├── components/           # Reusable UI components
│       │   ├── Header.tsx        # Navigation header
│       │   ├── BookCard.tsx      # Book display card
│       │   ├── Cart.tsx          # Shopping cart
│       │   ├── SearchBar.tsx     # Book search
│       │   └── RecommendedBooksCarousel.tsx
│       ├── pages/                # Page components
│       │   ├── HomePage.tsx      # Landing page
│       │   ├── BooksPage.tsx     # Browse all books
│       │   ├── BookDetailPage.tsx # Single book view
│       │   ├── AuthorsPage.tsx   # Browse authors
│       │   ├── AuthorBooksPage.tsx # Author's books
│       │   ├── LoginPage.tsx     # User login
│       │   ├── RegisterPage.tsx  # User registration
│       │   ├── ProfilePage.tsx   # User profile & addresses
│       │   ├── CheckoutPage.tsx  # Order checkout
│       │   └── OrderSuccessPage.tsx # Order confirmation
│       ├── context/
│       │   ├── AuthContext.tsx   # Authentication state
│       │   └── CartContext.tsx   # Shopping cart state
│       ├── hooks/
│       │   ├── useBooks.ts       # Book data hooks
│       │   └── useAuthors.ts     # Author data hooks
│       ├── services/
│       │   └── api.ts            # API client
│       └── types/
│           └── index.ts          # TypeScript definitions
│
├── 🛡️ admin/                      # Admin Dashboard Application
│   ├── Dockerfile                 # Admin containerization
│   ├── nginx.conf                # Admin Nginx config
│   ├── package.json              # Dependencies
│   ├── components.json           # UI components config
│   └── src/
│       ├── App.tsx               # Root with protected routes
│       ├── main.tsx              # Entry point
│       ├── components/
│       │   ├── sidebar/          # Admin sidebar navigation
│       │   ├── ProtectedRoute/   # Route protection
│       │   └── ui/               # Reusable UI components
│       ├── pages/
│       │   ├── auth/
│       │   │   └── LoginPage.tsx # Admin login
│       │   ├── book/
│       │   │   └── BookPage.tsx  # Book management
│       │   ├── author/
│       │   │   └── AuthorPage.tsx # Author management
│       │   └── user_manage/
│       │       ├── UserManage.tsx # User role management
│       │       └── Profile.tsx   # Admin profile
│       ├── context/
│       │   ├── AuthContext.tsx   # Admin authentication
│       │   └── BookContext.tsx   # Book state management
│       ├── services/
│       │   └── api.ts            # Admin API client
│       └── types/
│           └── index.ts          # TypeScript definitions
│
├── docker-compose.yml             # Multi-container orchestration
├── nginx.conf                    # Main Nginx configuration
└── README.md                     # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** v20.19+ or v22.12+
- **Python** 3.8+
- **Git**
- **Docker** (optional, for containerized deployment)

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/astrostar41ust/Academic-Project-Book-Store.git
cd Academic-Project-Book-Store
```

#### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows PowerShell
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask development server
python app.py
```
**Backend runs on:** `http://127.0.0.1:5000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
**Frontend runs on:** `http://localhost:5173`

#### 4. Admin Dashboard Setup
```bash
cd admin

# Install dependencies
npm install

# Start development server
npm run dev
```
**Admin dashboard runs on:** `http://localhost:5174`

### Docker Deployment

The application uses Docker Compose to orchestrate three services with Ngrok tunnels for public access:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

**Docker Services:**
- `backend-service`: Flask API (internal)
- `frontend-service`: Customer portal (exposed via Ngrok)
- `admin-service`: Admin dashboard (exposed via Ngrok)
- `ngrok-frontend`: Public tunnel for frontend
- `ngrok-admin`: Public tunnel for admin

**Access Points:**
- Ngrok Frontend UI: `http://localhost:4040`
- Ngrok Admin UI: `http://localhost:4041`

## 📡 API Documentation

### 🔐 Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "msg": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": {
      "id": 1,
      "name": "customer"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": {
      "id": 2,
      "name": "admin"
    }
  }
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### 📚 Books Endpoints

#### Get All Books
```http
GET /api/books/
```

**Response:** Array of books with `img_url` included

#### Get Recommended Books
```http
GET /api/books/recommended
```

#### Get Book by ID
```http
GET /api/books/<int:book_id>
```

#### Create Book (Admin Only)
```http
POST /api/books/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "string",
  "price": 29.99,
  "file_url": "string",
  "img_url": "string",
  "author_ids": [1, 2],
  "stock_quantity": 100,
  "publication_date": "2024-01-15",
  "is_recommended": false
}
```

#### Update Book (Admin Only)
```http
PUT /api/books/<int:book_id>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 34.99,
  "stock_quantity": 50,
  "is_recommended": true
}
```

#### Delete Book (Admin Only)
```http
DELETE /api/books/<int:book_id>
Authorization: Bearer <admin_token>
```

### 👥 Authors Endpoints

#### Get All Authors
```http
GET /api/authors/
```

**Response:** Array of authors with `book_count` and `image_url`

#### Get Author Profile
```http
GET /api/authors/<int:author_id>
```

**Response:** Author details with `books_written` array

#### Create Author (Admin Only)
```http
POST /api/authors/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "first_name": "Stephen",
  "last_name": "King",
  "image_url": "https://example.com/author.jpg"
}
```

#### Delete Author (Admin Only)
```http
DELETE /api/authors/<int:author_id>
Authorization: Bearer <admin_token>
```

**Note:** Cannot delete authors with associated books (returns 409 Conflict)

### 🛍️ Orders Endpoints

#### Get All Orders (Admin Only)
```http
GET /api/orders/admin/all
Authorization: Bearer <admin_token>
```

#### Get User Order
```http
GET /api/orders/<int:order_id>
Authorization: Bearer <token>
```

#### Place Order
```http
POST /api/orders/
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "book_id": 1,
      "quantity": 2
    },
    {
      "book_id": 3,
      "quantity": 1
    }
  ]
}
```

**Features:**
- Validates stock availability
- Automatically reduces book stock
- Calculates total amount
- Returns order details with items

#### Update Order Status (Admin Only)
```http
PUT /api/orders/admin/status/<int:order_id>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Completed"
}
```

**Valid statuses:** `Pending`, `Completed`, `Cancelled`

### 📍 Address Endpoints

#### Get User Addresses
```http
GET /api/addresses
Authorization: Bearer <token>
```

#### Create Address
```http
POST /api/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Home",
  "recipient_name": "John Doe",
  "phone_number": "0812345678",
  "address_line1": "123 Main Street",
  "address_line2": "Apt 4B",
  "district": "Bang Kapi",
  "sub_district": "Khlong Chan",
  "province": "Bangkok",
  "postal_code": "10240",
  "is_default": true
}
```

**Constraints:**
- Maximum 3 addresses per user
- First address automatically set as default
- Only one default address allowed

#### Update Address
```http
PUT /api/addresses/<int:address_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Office",
  "phone_number": "0898765432"
}
```

#### Delete Address
```http
DELETE /api/addresses/<int:address_id>
Authorization: Bearer <token>
```

**Behavior:** If default address is deleted, another address automatically becomes default

#### Set Default Address
```http
PUT /api/addresses/<int:address_id>/set-default
Authorization: Bearer <token>
```

### 👤 User Management (Admin Only)

#### Get All Users
```http
GET /api/users/
Authorization: Bearer <admin_token>
```

#### Update User Role (Superadmin Only)
```http
PUT /api/users/<int:user_id>/role
Authorization: Bearer <superadmin_token>
Content-Type: application/json

{
  "role_id": 2
}
```

**Role IDs:**
- `1`: customer
- `2`: admin

## 🗄️ Database Schema

### User Model
```python
- id: Integer (Primary Key)
- username: String(100), Not Null
- email: String(100), Unique, Not Null
- password_hash: String(128)
- role_id: Foreign Key → Role.id
```

### Role Model
```python
- id: Integer (Primary Key)
- name: String(50), Unique
  Values: "customer", "admin"
```

### Book Model
```python
- id: Integer (Primary Key)
- title: String(255), Not Null
- price: Float, Not Null
- stock_quantity: Integer, Default=0
- publication_date: Date, Nullable
- is_recommended: Boolean, Default=False
- file_url: String(512), Nullable
- img_url: String(512), Nullable
- authors: Many-to-Many → Author
```

### Author Model
```python
- id: Integer (Primary Key)
- first_name: String(50), Not Null
- last_name: String(50), Not Null
- image_url: String(255), Nullable
- books: Many-to-Many → Book
```

### Order Model
```python
- id: Integer (Primary Key)
- user_id: Foreign Key → User.id
- order_date: DateTime, Default=Now
- total_amount: Float, Not Null
- status: String(50), Default="Pending"
- items: One-to-Many → OrderItem
```

### OrderItem Model
```python
- id: Integer (Primary Key)
- order_id: Foreign Key → Order.id
- book_id: Foreign Key → Book.id
- quantity: Integer, Default=1
- price_at_purchase: Float, Not Null
```

### Address Model
```python
- id: Integer (Primary Key)
- user_id: Foreign Key → User.id
- label: String(50), e.g., "Home", "Work"
- recipient_name: String(100), Not Null
- phone_number: String(20), Not Null
- address_line1: String(255), Not Null
- address_line2: String(255), Nullable
- district: String(100), Not Null
- sub_district: String(100), Not Null
- province: String(100), Not Null
- postal_code: String(10), Not Null
- is_default: Boolean, Default=False
- created_at: DateTime, Default=Now
```

## 🔐 Authentication & Authorization

### JWT Configuration
- **Secret Key:** Configurable in `config.py`
- **Token Expiration:** 1 hour 24 minutes
- **Algorithm:** HS256

### Role-Based Access Control

**Public Endpoints (No Auth):**
- `GET /api/books/`
- `GET /api/books/<id>`
- `GET /api/books/recommended`
- `GET /api/authors/`
- `GET /api/authors/<id>`
- `POST /api/auth/register`
- `POST /api/auth/login`

**Customer Role:**
- All public endpoints
- `GET /api/auth/profile`
- `POST /api/orders/`
- `GET /api/orders/<id>` (own orders only)
- All `/api/addresses` endpoints

**Admin Role:**
- All customer permissions
- `POST /api/books/`
- `PUT /api/books/<id>`
- `DELETE /api/books/<id>`
- `POST /api/authors/`
- `DELETE /api/authors/<id>`
- `GET /api/users/`
- `GET /api/orders/admin/all`
- `PUT /api/orders/admin/status/<id>`

**Superadmin Role:**
- All admin permissions
- `PUT /api/users/<id>/role`

### Making a User Admin

**Method 1: Direct Database Update**
```bash
python -c "import sqlite3; conn=sqlite3.connect('backend/instance/bookstore.db'); conn.execute('UPDATE user SET role_id = 2 WHERE username=\"your_username\"'); conn.commit(); print('User upgraded to admin')"
```

**Method 2: Python Script**
```python
# make_admin.py
from models.models import db, User
from app import create_app

app = create_app()
with app.app_context():
    user = User.query.filter_by(username="your_username").first()
    if user:
        user.role_id = 2
        db.session.commit()
        print(f"{user.username} is now an admin")
```

## 📱 Features Overview

### Customer Frontend Features
✅ User registration and authentication  
✅ Browse books with pagination and search  
✅ View book details with author information  
✅ Browse authors and their published books  
✅ Shopping cart functionality  
✅ Recommended books carousel  
✅ User profile management  
✅ Multiple shipping addresses (max 3)  
✅ Order checkout and confirmation  
✅ Responsive design with HeroUI components  

### Admin Dashboard Features
✅ Admin authentication with protected routes  
✅ Book management (CRUD operations)  
✅ Author management (create, view, delete)  
✅ User role management (upgrade to admin)  
✅ Order management and status updates  
✅ Stock inventory management  
✅ Recommended books flagging  
✅ Real-time notifications with Toastify  
✅ Confirmation dialogs with SweetAlert2  

### Backend Features
✅ RESTful API architecture  
✅ JWT-based authentication  
✅ Role-based access control (@requires_roles)  
✅ SQLAlchemy ORM with relationships  
✅ Many-to-many author-book associations  
✅ Order processing with stock validation  
✅ Automatic stock quantity reduction  
✅ Address management with default flag  
✅ CORS configured for frontend access  
✅ Database migrations support  
✅ Error handling and validation  

## 🔧 Configuration

### Backend Configuration (`backend/config.py`)
```python
class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///bookstore.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'admin_secret_key'  # Change in production
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1, minutes=24)
    SECRET_KEY = 'admin_secret_key'  # Change in production
```

### Frontend API Configuration (`frontend/src/services/api.ts`)
```typescript
const API_BASE_URL = '/api';  // Proxied to backend in development
```

### Docker Compose Ngrok Configuration
```yaml
ngrok-frontend:
  environment:
    NGROK_AUTHTOKEN: "your_frontend_token"

ngrok-admin:
  environment:
    NGROK_AUTHTOKEN: "your_admin_token"
```

## 🧪 Testing the Application

### Test User Flow

1. **Register a customer:**
```bash
curl -X POST http://127.0.0.1:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"customer1","email":"customer@test.com","password":"test123"}'
```

2. **Login and get token:**
```bash
curl -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"customer1","password":"test123"}'
```

3. **Create an address:**
```bash
curl -X POST http://127.0.0.1:5000/api/addresses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"label":"Home","recipient_name":"John Doe","phone_number":"0812345678","address_line1":"123 Main St","district":"Bang Kapi","sub_district":"Khlong Chan","province":"Bangkok","postal_code":"10240"}'
```

4. **Place an order:**
```bash
curl -X POST http://127.0.0.1:5000/api/orders/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"book_id":1,"quantity":2}]}'
```

### Test Admin Flow

1. **Upgrade user to admin** (see Authentication section)

2. **Login as admin** to get new token

3. **Create an author:**
```bash
curl -X POST http://127.0.0.1:5000/api/authors/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"George","last_name":"Orwell","image_url":"https://example.com/orwell.jpg"}'
```

4. **Create a book:**
```bash
curl -X POST http://127.0.0.1:5000/api/books/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","price":15.99,"file_url":"https://example.com/1984.pdf","img_url":"https://example.com/1984.jpg","author_ids":[1],"stock_quantity":50,"is_recommended":true}'
```

5. **View all orders:**
```bash
curl -X GET http://127.0.0.1:5000/api/orders/admin/all \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## 🚨 Common Issues & Solutions

### Issue: Token Expired
**Solution:** JWT tokens expire after 1 hour 24 minutes. Login again to obtain a new token.

### Issue: 403 Forbidden on Admin Endpoints
**Solution:** Ensure the user has been upgraded to admin role using the database update method.

### Issue: Address Limit Reached
**Solution:** Users can only have 3 addresses. Delete an existing address before creating a new one.

### Issue: Insufficient Stock Error
**Solution:** Check book inventory using `GET /api/books/<id>` and ensure adequate `stock_quantity`.

### Issue: Cannot Delete Author with Books
**Solution:** Either delete all associated books first or reassign them to different authors.

### Issue: CORS Errors in Development
**Solution:** Ensure Flask backend is running with `CORS(app)` enabled and frontend proxy is configured.

## 📦 Build for Production

### Frontend Production Build
```bash
cd frontend
npm run build
# Output: dist/ directory
```

### Admin Production Build
```bash
cd admin
npm run build
# Output: dist/ directory
```

### Backend Production Setup
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is developed for academic purposes as part of a university coursework.

## 👥 Authors

- **astrostar41ust** - [GitHub Profile](https://github.com/astrostar41ust)

## 🙏 Acknowledgments

- Flask documentation and community
- React and Vite teams
- HeroUI component library
- Tailwind CSS framework

---

**For questions, issues, or contributions, please open an issue on GitHub.**

**Repository:** [Academic-Project-Book-Store](https://github.com/astrostar41ust/Academic-Project-Book-Store)