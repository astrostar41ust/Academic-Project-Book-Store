import React from "react";
import type { Book } from "../types";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden group/card"
    >
      {/* Book Image */}
      <div className="relative">
        <div className="w-full h-80 overflow-hidden bg-gray-100">
          {book.img_url ? (
            <img
              src={book.img_url}
              alt={book.title}
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 h-14 group-hover/card:text-blue-600 transition-colors">
          {book.title}
        </h3>

        {(book.author || book.authors?.[0]) && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
            By {book.author?.name || book.authors?.[0]?.name}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${book.price.toFixed(2)}
          </span>
          
          <span
            className={`text-xs px-2 py-1 rounded ${
              book.stock_quantity > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {book.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
    </div>
  );
};

export default BookCard;
