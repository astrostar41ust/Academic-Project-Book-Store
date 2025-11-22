import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: { value: string; label: string }[];
  searchPlaceholder?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery = '', 
  onSearchChange, 
  sortBy = '', 
  onSortChange,
  sortOptions,
  searchPlaceholder = 'Search...'
}) => {
  const { isAuthenticated, user, logout, } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isBooksPage = location.pathname === '/books';
  const isAuthorsPage = location.pathname === '/authors';
  const showSearch = (isBooksPage || isAuthorsPage) && onSearchChange;

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  const handleDropdownLinkClick = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-blue-600 text-white shadow-lg fixed top-0 left-0 w-full z-[9999]">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 whitespace-nowrap">
            📚 BookStore
          </Link>

          {/* Search Bar - Books & Authors Pages */}
          {showSearch && (
            <div className="flex-1">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                sortBy={sortBy}
                onSortChange={onSortChange}
                sortOptions={sortOptions}
                placeholder={searchPlaceholder}
                showSort={true}
              />
            </div>
          )}

          <div className="flex items-center space-x-4 ml-auto">
            {/* Cart Button */}
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

            {/* User Dropdown */}
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

                  {/* ✅ Dropdown Always on Top */}
                  {dropdownOpen && (
                    <div className="absolute bg-white text-black shadow-lg rounded mt-2 z-[99999]">
                      <ul className="py-2">
                        

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
                            className="block w-full text-left px-4 py-2 hover:bg-red-200 transition-colors"
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
