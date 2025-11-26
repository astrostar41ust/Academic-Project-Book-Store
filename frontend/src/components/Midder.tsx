import React from "react";
import { Link, useLocation } from "react-router-dom";

const Midder: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <footer
      className="py-4 fixed top-[60px] left-0 w-full z-40 
        bg-gradient-to-r from-blue-100/70 via-blue-200/70 to-blue-100/70
        backdrop-blur-xl shadow-sm"
    >
      <div className="container mx-auto px-4 flex space-x-10">
        <Link
          to="/"
          className="relative group text-blue-900 text-sm  font-medium tracking-wide"
        >
          <span className="pb-1 group-hover:text-blue-700 transition-colors">
            Home
          </span>
          <span
            className={`absolute left-0 -bottom-1 h-[3px] rounded-full bg-blue-500 transition-all duration-300 
            ${isActive("/") ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

        <Link
          to="/books"
          className="relative group text-blue-900 font-medium text-sm tracking-wide"
        >
          <span className="pb-1 group-hover:text-blue-700 transition-colors">
            Books
          </span>
          <span
            className={`absolute left-0 -bottom-1 h-[3px] rounded-full bg-blue-500 transition-all duration-300
            ${isActive("/books") ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

        <Link
          to="/authors"
          className="relative group text-blue-900 font-medium  text-sm tracking-wide"
        >
          <span className="pb-1 group-hover:text-blue-700 transition-colors">
            Authors
          </span>
          <span
            className={`absolute left-0 -bottom-1 h-[3px] rounded-full bg-blue-500 transition-all duration-300
            ${isActive("/authors") ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>
      </div>
    </footer>
  );
};

export default Midder;
