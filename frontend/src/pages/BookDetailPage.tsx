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
  const [showImageModal, setShowImageModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
      quantity: quantity,
      img_url: book.img_url,
      author: book.author?.name,
    });

    setShowModal(true);
  };

  const handleBuyNow = () => {
    if (!book) return;
    
    // Add to cart first
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      quantity: quantity,
      img_url: book.img_url,
      author: book.author?.name,
    });

    // Navigate to cart
    navigate('/cart');
  };

  const incrementQuantity = () => {
    if (book && quantity < book.stock_quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/books')}
            className="mb-8 flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Books
          </button>

          {/* Book Detail Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Book Image Section - 2 columns */}
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-sm">
                  {book.img_url ? (
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="w-full group relative"
                    >
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-white ring-4 ring-white/50 transform transition-transform hover:scale-105 duration-300">
                        <img
                          src={book.img_url}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/95 rounded-full p-4 shadow-2xl transform group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-white ring-4 ring-white/50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Book Information Section - 3 columns */}
              <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col">
                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">{book.title}</h1>

                {/* Author */}
                {book.author && (
                  <div className="mb-5">
                    <p className="text-xs text-gray-500 mb-1">Written by</p>
                    <button
                      onClick={() => navigate(`/authors/${book.author?.id}/books`)}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                    >
                      {book.author.name}
                    </button>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ${book.price.toFixed(2)}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm">
                    {book.stock_quantity > 0 ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-700">In Stock ({book.stock_quantity} available)</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-700">Out of Stock</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Published</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {new Date(book.publication_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Spacer to push buttons to bottom */}
                <div className="flex-grow"></div>

                {/* Quantity Selector and Buttons */}
                {book.stock_quantity > 0 ? (
                  <div className="space-y-5 mt-auto">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:border-blue-400 transition-colors">
                        <button
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                          </svg>
                        </button>
                        <div className="w-14 h-9 flex items-center justify-center border-x-2 border-gray-300 font-semibold text-base text-gray-800">
                          {quantity}
                        </div>
                        <button
                          onClick={incrementQuantity}
                          disabled={quantity >= book.stock_quantity}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 py-4 px-6 rounded-2xl font-bold text-base transition-all duration-200 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </span>
                      </button>

                      {/* Buy Now Button */}
                      <button
                        onClick={handleBuyNow}
                        className="flex-1 py-4 px-6 rounded-2xl font-bold text-base transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Buy Now
                      </button>
                    </div>

                    {/* Shipping Info */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                        </svg>
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-0.5">🚚 Free Shipping</p>
                          <p className="text-xs text-blue-700">Delivered to your doorstep</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto">
                    <button
                      disabled
                      className="w-full py-4 px-6 rounded-2xl font-bold text-lg bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300"
                    >
                      Out of Stock
                    </button>
                  </div>
                )}
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

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black transition-opacity duration-300"
            style={{ opacity: 0.5 }}
            onClick={() => setShowImageModal(false)}
          />

          {/* Close Button */}
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
          >
            <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Container */}
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {book.img_url ? (
              <img
                src={book.img_url}
                alt={book.title}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="w-96 h-[512px] flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl">
                <svg className="w-32 h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookDetailPage;
