import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { booksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import RecommendedBooksCarousel from '../components/RecommendedBooksCarousel';
import type { Book } from '../types';
import img1 from '../assets/image/1.jpg';
import img2 from '../assets/image/2.jpg';
import img3 from '../assets/image/3.jpg';
import img4 from '../assets/image/4.jpg';
import img5 from '../assets/image/5.jpg';
import img6 from '../assets/image/6.jpg';
import img7 from '../assets/image/7.jpg';
import img8 from '../assets/image/8.jpg';
import img9 from '../assets/image/9.jpg';

// Banner Images
const bannerImages = [
  { src: img1, alt: "Banner 1" },
  { src: img2, alt: "Banner 2" },
  { src: img3, alt: "Banner 3" },
];

const topPromotions = [
  { id: 1, src: img1 , alt: "รวมโปรโมชั่น" },
  { id: 2, src: img2 , alt: "ส่งฟรีทั่วประเทศ" },
  { id: 3, src: img3 , alt: "ลดสูงสุด 50%" },
  { id: 4, src: img4 , alt: "ช้อปครบรับเพิ่ม" },
  { id: 5, src: img5 , alt: "หนังสือใหม่" },
  { id: 6, src: img6 , alt: "หนังสือแนะนำ" },
];

const bottomPromotions = [
  { id: 1, src: img7, alt: "หนังสือขายดี" },
  { id: 2, src: img8, alt: "หนังสือมือสอง" },
  { id: 3, src: img9, alt: "หนังสือเรียน" },
];

// --- ICONS ---

// 1. Arrow Right Icon
const ArrowRightIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// 2. Star Icon (Solid)
const StarIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-6 h-6 text-yellow-400" 
  >
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const HomePage: React.FC = () => {
  const { loading, error } = useBooks();
  const [bannerIndex, setBannerIndex] = useState(0);
  
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [newArrivalBooks, setNewArrivalBooks] = useState<Book[]>([]); 
  const [loadingData, setLoadingData] = useState(true);
  
  const navigate = useNavigate();

  const handleDotClick = (index: number) => {
    setBannerIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [recData, newData] = await Promise.all([
            booksAPI.getRecommended(),
            booksAPI.getAll()
        ]);
        setRecommendedBooks(recData);
        const recommendedIds = new Set(recData.map(book => book.id));
        const filteredNewBooks = newData.filter(book => !recommendedIds.has(book.id));
        setNewArrivalBooks(filteredNewBooks);
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="large" className="py-20" />;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <>
      <div className="pt-[150px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BookStore</h1>
        </div>

        {/* MAIN BANNER */}
        <div className="mb-10 container mx-auto px-4">
          <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl bg-gray-200 group">
            <img
              src={bannerImages[bannerIndex].src}
              alt={bannerImages[bannerIndex].alt}
              className="w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/1500x550?text=Main+Banner"; }}
            />
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`
                    h-2.5 rounded-full transition-all duration-300 shadow-sm
                    ${bannerIndex === index 
                      ? "w-8 bg-white opacity-100" 
                      : "w-2.5 bg-white/60 hover:bg-white/90 hover:scale-110"
                    }
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          
          {/* 1. RECOMMENDED SECTION */}
          {!loadingData && recommendedBooks.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                 {/* Blue Accent Line + Star */}
                 <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4 flex items-center gap-2">
                    Recommended
                    <StarIcon />
                 </h2>
                 <button 
                    onClick={() => navigate('/books')} 
                    className="text-blue-600 flex items-center gap-2 group font-medium hover:text-blue-700 transition-colors"
                  >
                    View All
                    <ArrowRightIcon />
                 </button>
              </div>
              <RecommendedBooksCarousel books={recommendedBooks} />
            </section>
          )}

          {/* PROMOTION SECTION */}
           <section className="mb-16 py-8 border-t border-b border-gray-100">
            {/* ✅ แก้ไข: เพิ่ม border-l-4 (สีส้ม) และ pl-4 ให้โปรโมชั่น */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4">
              โปรโมชั่น
            </h2>
            
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
              {topPromotions.map((promo) => (
                <div 
                  key={promo.id} 
                  className="w-40 h-40 md:w-60 md:h-60 flex-shrink-0 snap-center transition-transform hover:scale-105 relative rounded-2xl shadow-md overflow-hidden"
                >
                  <img src={promo.src} alt={promo.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {bottomPromotions.map((promo) => (
                <div key={promo.id} className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all h-48 md:h-64">
                    <img 
                    src={promo.src} 
                    alt={promo.alt} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 2. NEW ARRIVALS SECTION */}
          {!loadingData && newArrivalBooks.length > 0 && (
             <section className="mb-12">
               <div className="flex items-center justify-between mb-6">
                  {/* Emerald Accent Line */}
                  <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-emerald-500 pl-4">
                    New Arrivals
                  </h2>
                  <button 
                    onClick={() => navigate('/books?sort=newest')} 
                    className="text-emerald-600 flex items-center gap-2 group font-medium hover:text-emerald-700 transition-colors"
                  >
                    View All
                    <ArrowRightIcon />
                  </button>
               </div>
               <RecommendedBooksCarousel books={newArrivalBooks} />
             </section>
          )}

        </div>
      </div>
    </>
  );
};

export default HomePage;