import React from "react";
import { Link, useLocation } from "react-router-dom";

const Midder: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <footer className="py-4 shadow-lg fixed top-15 left-0 w-full z-50 bg-white">
      <div className="container mx-auto px-4 flex justify-center space-x-8">

        <Link to="/" className="relative group">
          <span className="pb-1">Home</span>
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-blue-500 transition-all 
            ${isActive("/") ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

        <Link to="/books" className="relative group">
          <span className="pb-1">Books</span>
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-blue-500 transition-all 
            ${isActive("/books") ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

        <Link to="/authors" className="relative group">
          <span className="pb-1">Authors</span>
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-blue-500 transition-all 
            ${isActive("/authors") ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

      </div>
    </footer>
  );
};

export default Midder;
