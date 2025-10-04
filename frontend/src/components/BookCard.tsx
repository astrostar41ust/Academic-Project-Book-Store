import React from 'react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
        <span className="text-2xl font-bold text-blue-600">${book.price}</span>
      </div>
      
      <div className="space-y-2 text-gray-600">
        <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
        {book.author && (
          <p><span className="font-medium">Author:</span> {book.author.name}</p>
        )}
        <p><span className="font-medium">Published:</span> {new Date(book.publication_date).toLocaleDateString()}</p>
        <p><span className="font-medium">Stock:</span> {book.stock_quantity} available</p>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <span className={`px-2 py-1 rounded text-sm ${
          book.stock_quantity > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {book.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
        
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart functionality here
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;