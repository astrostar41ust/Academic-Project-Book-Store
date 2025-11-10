import React, { useState, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card/Card'

const bannerImages = [
  {
    src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/... (ยาวมากตัดออกได้)",
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
      {/* ✅ ขยับหน้าให้ลงมา 100px */}
      <div className="pt-[150px]">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BookStore</h1>
        </div>

        {/* ✅ Banner Carousel */}
        <div className="mb-10 relative left-1/2 right-1/2 -translate-x-1/2 w-screen max-w-none flex items-center justify-center">
          <img
            src={bannerImages[bannerIndex].src}
            alt={bannerImages[bannerIndex].alt}
            className="w-full object-cover"
            style={{ maxHeight: 320, height: 320 }}
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

        {/* ✅ Featured Books */}
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 relative inline-block">
  Featured Books
  <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-500 rounded"></span>
</h2>

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
      </div>
    </>
  );
};

export default HomePage;
