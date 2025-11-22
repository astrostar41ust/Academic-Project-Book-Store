import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { booksAPI } from '../services/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import RecommendedBooksCarousel from '../components/RecommendedBooksCarousel';
import type { Book } from '../types';

const bannerImages = [
  {
    src: "https://img.freepik.com/free-vector/hand-drawn-literature-facebook-cover_23-2149721058.jpg?semt=ais_hybrid&w=740&q=80",
    alt: "New Books Up to 27% Off",
  },
  {
    src: "https://i.imgur.com/3yQF1bC.jpg",
    alt: "Best Selling Book Promotions",
  },
  {
    src: "https://i.imgur.com/6QK8QkT.jpg",
    alt: "Book Fair ลดพิเศษ",
  },
];

const HomePage: React.FC = () => {
  const { books, loading, error } = useBooks();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const navigate = useNavigate();

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch recommended books
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoadingRecommended(true);
        const data = await booksAPI.getRecommended();
        setRecommendedBooks(data);
      } catch (err) {
        console.error('Failed to fetch recommended books:', err);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommended();
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
      {/* 100px */}
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

        {/* ✅ Recommended Books Section */}
        <div className="container mx-auto px-4 py-8">
          {!loadingRecommended && recommendedBooks.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2 relative inline-block">
                    <span className="flex items-center gap-2">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Recommended 
                    </span>
                    <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-blue-500 to-indigo-600 rounded"></span>
                  </h2>
                  <p className="text-gray-600 mt-2">Curated just for you</p>
                </div>
                <button
                  onClick={() => navigate('/books')}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                >
                  View All
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <RecommendedBooksCarousel books={recommendedBooks} />
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
