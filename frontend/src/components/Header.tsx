import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/image/logo.png";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: { value: string; label: string }[];
  searchPlaceholder?: string;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery = "",
  onSearchChange,
  sortBy = "",
  onSortChange,
  sortOptions,
  searchPlaceholder = "Search...",
}) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isBooksPage = location.pathname === "/books";
  const isAuthorsPage = location.pathname === "/authors";
  const showSearch = (isBooksPage || isAuthorsPage) && onSearchChange;

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const handleGoToCart = () => navigate("/cart");

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  const handleDropdownLinkClick = () => setDropdownOpen(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 text-blue-900 shadow-md fixed top-0 h-[70px] left-0 w-full z-[9999] border-b border-blue-300/40 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-2">
        <nav className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} width={50} className="drop-shadow-md" />
          </Link>

          {/* Search bar on book/author page */}
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

          {/* Right Menu */}
          <div className="ml-auto flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={handleGoToCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl text-white"
            >
              🛒 Cart
              {cart.length > 0 && (
                <span
                  className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 
                  bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md"
                >
                  {cart.length}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 cursor-pointer bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all shadow-md"
                >
                  <FaUserCircle size={24} className="text-white" />
                  <span className="font-medium">{user?.username}</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
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
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-40 bg-white text-black shadow-xl rounded-xl overflow-hidden animate-fadeIn">
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-100 transition-all"
                          onClick={handleDropdownLinkClick}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 transition-all"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-white font-medium hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all"
              >
                <FaUserCircle size={20} />
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
