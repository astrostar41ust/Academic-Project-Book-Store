import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import AddToCartModal from "./AddToCartModal";
import type { Book } from "../types";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  console.log("Data api:", book);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Add to cart
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      quantity: 1,
      img_url: book.img_url,
      author: book.author?.name,
    });

    // Show modal
    setShowModal(true);
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
        onClick={onClick}
      >
        {/* Image Container with Fixed Aspect Ratio */}
        <div className="w-full h-80 mb-4 flex items-center justify-center overflow-hidden rounded-md bg-gray-100 relative">
          <img 
            src={book.img_url} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 flex-1 mr-2">
            {book.title}
          </h3>
          <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">${book.price}</span>
        </div>
        <div className="space-y-2 text-gray-600 flex-grow">
          {book.author && (
            <p>
              <span className="font-medium">Author:</span> {book.author.name}
            </p>
          )}
          <p>
            <span className="font-medium">Published:</span>{" "}
            {new Date(book.publication_date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Stock:</span> {book.stock_quantity}{" "}
            available
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span
            className={`px-2 py-1 rounded text-sm ${
              book.stock_quantity > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {book.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-200 hover:scale-105"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        bookTitle={book.title}
      />
    </>
  );
};

export default BookCard;
