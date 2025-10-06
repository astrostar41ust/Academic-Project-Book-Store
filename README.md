# 📚 Academic Project: Book Store

A full-stack web application for managing an online bookstore with user authentication, book management, and author management.

## 🚀 Tech Stack

### Backend
- **Framework:** Flask (Python)
- **Database:** SQLite
- **Authentication:** JWT (Flask-JWT-Extended)
- **ORM:** SQLAlchemy
- **CORS:** Flask-CORS

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **State Management:** Context API + Custom Hooks

## 🏗️ Project Structure

```
📦 Academic-Project-Book-Store/
├── 🔧 backend/                 # Flask API Server
│   ├── app.py                  # Main Flask application
│   ├── config.py              # Database & JWT configuration
│   ├── requirements.txt       # Python dependencies
│   ├── instance/
│   │   └── bookstore.db      # SQLite database
│   ├── models/
│   │   └── models.py         # Database models (User, Book, Author, Role)
│   ├── routes/
│   │   ├── auth_routes.py    # Authentication endpoints
│   │   ├── book_routes.py    # Book management endpoints
│   │   └── author_routes.py  # Author management endpoints
│   └── libs/
│       └── utils.py          # Utility functions (role decorators)
├── 🎨 frontend/               # React Application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context (AuthContext)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   └── types/           # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml         # Docker containerization
├── nginx.conf                # Nginx reverse proxy config
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v20.19+ or v22.12+)
- **Python** (3.8+)
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/astrostar41ust/Academic-Project-Book-Store.git
cd Academic-Project-Book-Store
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```
**Backend will run on:** `http://127.0.0.1:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
**Frontend will run on:** `http://localhost:5173`

## 🎯 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/auth/register` | User registration | ❌ | - |
| POST | `/api/auth/login` | User login | ❌ | - |
| GET | `/api/auth/profile` | Get user profile | ✅ | - |

### Books
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/books/` | Get all books | ❌ | - |
| GET | `/api/books/{id}` | Get book by ID | ❌ | - |
| POST | `/api/books/` | Create new book | ✅ | Admin |
| PUT | `/api/books/{id}` | Update book | ✅ | Admin |
| DELETE | `/api/books/{id}` | Delete book | ✅ | Admin |

### Authors
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/authors/` | Get all authors | ❌ | - |
| GET | `/api/authors/{id}` | Get author by ID | ❌ | - |
| POST | `/api/authors/` | Create new author | ✅ | Admin |

## 🧪 Testing with Postman

### Step 1: Register a New User
```http
POST http://127.0.0.1:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Step 2: Login to Get Token
```http
POST http://127.0.0.1:5000/api/auth/login
Content-Type: application/json

{
  "username": "testuser", 
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "role": "customer"
  }
}
```

### Step 3: Upgrade User to Admin (Required for POST operations)

#### Option A: Using Python Script
```bash
cd backend
python make_admin.py testuser
```

#### Option B: Direct Database Update
```bash
python -c "import sqlite3; conn=sqlite3.connect('backend/instance/bookstore.db'); conn.execute('UPDATE user SET role_id = 2 WHERE username=\"testuser\"'); conn.commit(); print('Updated to Admin!')"
```

### Step 4: Login Again to Get Admin Token
Repeat Step 2 to get a new token with admin privileges.

### Step 5: Test Admin Endpoints

#### Create Author
```http
POST http://127.0.0.1:5000/api/authors/
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "first_name": "J.K.",
  "last_name": "Rowling"
}
```

#### Create Book
```http
POST http://127.0.0.1:5000/api/books/
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Harry Potter and the Philosopher's Stone",
  "isbn": "9780747532699",
  "price": 19.99,
  "file_url": "https://example.com/book.pdf",
  "author_ids": [1]
}
```

## 🔐 Authentication Flow

1. **Register** → Creates user with `customer` role
2. **Login** → Returns JWT token (expires in 1 hour)
3. **Upgrade to Admin** → Required for POST/PUT/DELETE operations
4. **Use Token** → Include in `Authorization: Bearer <token>` header

## 🐳 Docker Deployment (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access application
# Frontend: http://localhost (port 80)
# Backend API: http://localhost/api
```

## 📱 Features Implemented

### Frontend
- ✅ User authentication (login/register)
- ✅ Book browsing and display
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe development with TypeScript
- ✅ State management with Context API
- ✅ Custom hooks for API integration

### Backend
- ✅ RESTful API design
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/Customer)
- ✅ SQLAlchemy ORM with relationships
- ✅ CORS support for frontend integration
- ✅ Input validation and error handling

## 🔧 Development Tips

### Common Issues

1. **Token Expired**: Tokens expire in 1 hour. Login again to get a new token.

2. **403 Forbidden**: User doesn't have admin role. Use `make_admin.py` script.

3. **Author Not Found**: When creating books, ensure authors exist first.

4. **CORS Errors**: Make sure backend is running and CORS is configured.

### Database Schema

- **Users**: `id`, `username`, `email`, `password_hash`, `role_id`
- **Roles**: `id`, `name` (customer, admin)  
- **Books**: `id`, `title`, `isbn`, `price`, `file_url`
- **Authors**: `id`, `first_name`, `last_name`
- **Book-Author**: Many-to-many relationship table

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is for academic purposes.

---

**Happy Coding! 🚀**

For questions or issues, please create an issue in the GitHub repository.
