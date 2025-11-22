import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { booksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AddToCartModal from '../components/AddToCartModal';
import type { Book } from '../types';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await booksAPI.getById(parseInt(id));
        
        // Normalize authors array to single author for backward compatibility
        if (response.authors && response.authors.length > 0 && !response.author) {
          response.author = response.authors[0];
        }
        
        setBook(response);
      } catch (err: any) {
        setError(err.message || 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;

    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      quantity: 1,
      img_url: book.img_url,
      author: book.author?.name,
    });

    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4">
          <LoadingSpinner size="large" className="py-20" />
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error || 'Book not found'}
          </div>
          <button
            onClick={() => navigate('/books')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/books')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Books
          </button>

          {/* Book Detail Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Book Image */}
              <div className="flex justify-center items-start">
                <div className="w-full max-w-md">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl bg-gray-100">
                    {book.img_url ? (
                      <img
                        src={book.img_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Information */}
              <div className="flex flex-col">
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>

                {/* Author */}
                {book.author && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Written by</p>
                    <p className="text-2xl font-semibold text-blue-600">{book.author.name}</p>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-4xl font-bold text-green-600">${book.price.toFixed(2)}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Published</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(book.publication_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Stock</p>
                    <p className="font-semibold text-gray-800">{book.stock_quantity} available</p>
                  </div>
                  {book.isbn && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 mb-1">ISBN</p>
                      <p className="font-semibold text-gray-800">{book.isbn}</p>
                    </div>
                  )}
                </div>

                {/* Stock Status Badge */}
                <div className="mb-6">
                  <span
                    className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                      book.stock_quantity > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.stock_quantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock_quantity === 0}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg ${
                    book.stock_quantity > 0
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {book.stock_quantity > 0 ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </span>
                  ) : (
                    'Out of Stock'
                  )}
                </button>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Fast & Free Shipping</p>
                      <p>Get your book delivered to your doorstep with free shipping on all orders.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default BookDetailPage;
