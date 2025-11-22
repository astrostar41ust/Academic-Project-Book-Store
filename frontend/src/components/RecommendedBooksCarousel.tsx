import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AddToCartModal from './AddToCartModal';
import type { Book } from '../types';

interface RecommendedBooksCarouselProps {
  books: Book[];
}

const RecommendedBooksCarousel: React.FC<RecommendedBooksCarouselProps> = ({ books }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookTitle, setSelectedBookTitle] = useState('');

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [books]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      quantity: 1,
      img_url: book.img_url,
      author: book.author?.name || book.authors?.[0]?.name,
    });

    setSelectedBookTitle(book.title);
    setShowModal(true);
  };

  if (books.length === 0) return null;

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Books Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => navigate(`/books/${book.id}`)}
            className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden group/card"
          >
            {/* Recommended Badge */}
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Must Read
                </span>
              </div>

              {/* Book Image */}
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

              {book.author && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                  By {book.author.name}
                </p>
              )}

              <div className="flex items-center justify-between">
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
            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* CSS to hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        bookTitle={selectedBookTitle}
      />
    </div>
  );
};

export default RecommendedBooksCarousel;
