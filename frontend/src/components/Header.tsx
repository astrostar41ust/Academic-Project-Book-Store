import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; // Import CartContext

const Header: React.FC = () => {
  const { isAuthenticated, token, user, logout, loading } = useAuth();
  const { cart } = useCart(); // Access cart from CartContext
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false); // Close dropdown after logout
  };

  const handleGoToCart = () => {
    navigate("/cart"); // Navigate to the cart page
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  const handleDropdownLinkClick = () => {
    setDropdownOpen(false); // Close dropdown after clicking a link
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated == true) {
      console.log(user);
      console.log(token);
      console.log(loading);
      console.log(isAuthenticated);
      console.log(user?.username);
      console.log("Role is : ", user?.role);
    }
  }, [isAuthenticated, user]);
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
            <Link
              to="/authors"
              className="hover:text-blue-200 transition-colors"
            >
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
                <div className="relative" ref={dropdownRef}>
                  <span
                    className="text-blue-200 cursor-pointer flex items-center"
                    onClick={toggleDropdown}
                  >
                    Hello, {user?.username}!

                    <svg
                      className={`w-4 h-4 ml-1 transform transition-transform ${
                        dropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                  {dropdownOpen && (
                    <div className="absolute bg-white text-black shadow-lg rounded mt-2">
                      <ul className="py-2">
                        {user?.role === "admin" && (
                          <li>
                            <Link
                              to="/admin"
                              className="block px-4 py-2 hover:bg-gray-200 transition-colors"
                              onClick={handleDropdownLinkClick}
                            >
                              Admin Panel
                            </Link>
                          </li>
                        )}
                        <li>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-gray-200 transition-colors"
                            onClick={handleDropdownLinkClick}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200 transition-colors"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
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
