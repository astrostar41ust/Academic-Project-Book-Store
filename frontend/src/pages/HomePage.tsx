import React, { useState, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';

const bannerImages = [
  {
    src: "data:image/jpeg;base64,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",
    alt: "หนังสือใหม่ ลดสูงสุด 27%",
  },
  {
    src: "https://i.imgur.com/3yQF1bC.jpg",
    alt: "โปรโมชั่นหนังสือขายดี",
  },
  {
    src: "https://i.imgur.com/6QK8QkT.jpg",
    alt: "Book Fair ลดพิเศษ",
  },
];

const HomePage: React.FC = () => {
  const { books, loading, error } = useBooks();
  const [bannerIndex, setBannerIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="large" className="py-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BookStore</h1>
        <p className="text-xl text-gray-600">Discover amazing books from our collection</p>
      </div>
      {/* Banner carousel section (full width) */}
      <div className="mb-10 relative left-1/2 right-1/2 -translate-x-1/2 w-screen max-w-none flex items-center justify-center">
        <img
          src={bannerImages[bannerIndex].src}
          alt={bannerImages[bannerIndex].alt}
          className="w-full object-cover"
          style={{ maxHeight: 320, height: 320 }} // เพิ่มความสูง banner
        />
        {/* Dots indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerImages.map((_, idx) => (
            <span
              key={idx}
              className={`block w-2 h-2 rounded-full ${idx === bannerIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Books</h2>
          
          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No books available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.slice(0, 8).map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book}
                  onClick={() => {
                    // Navigate to book detail page
                    console.log('Navigate to book:', book.id);
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {books.length > 8 && (
          <div className="text-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
              View All Books
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;