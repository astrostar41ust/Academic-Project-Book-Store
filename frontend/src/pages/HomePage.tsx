import React from 'react';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { books, loading, error } = useBooks();

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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BookStore</h1>
        <p className="text-xl text-gray-600">Discover amazing books from our collection</p>
      </div>

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
  );
};

export default HomePage;