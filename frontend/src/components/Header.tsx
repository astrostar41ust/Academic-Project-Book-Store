import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import CartContext

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart(); // Access cart from CartContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoToCart = () => {
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200">
            📚 BookStore
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link to="/books" className="hover:text-blue-200 transition-colors">
              Books
            </Link>
            <Link to="/authors" className="hover:text-blue-200 transition-colors">
              Authors
            </Link>
            <button 
              onClick={handleGoToCart} 
              className="relative flex items-center border border-white px-3 py-1 rounded hover:bg-blue-500 transition-colors"
            >
              🛒<span className="ml-2">Cart</span>
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {cart.length}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role.name === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="hover:text-blue-200 transition-colors">
                  Profile
                </Link>
                <span className="text-blue-200">Hello, {user?.username}!</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-500 hover:bg-green-400 px-3 py-1 rounded transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;