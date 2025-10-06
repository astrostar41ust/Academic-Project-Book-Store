import React from 'react';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';

const BooksPage: React.FC = () => {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Books</h1>
        <div className="flex items-center space-x-4">
          <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Sort by...</option>
            <option value="title">Title</option>
            <option value="price">Price</option>
            <option value="publication_date">Publication Date</option>
          </select>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books available.</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">Found {books.length} book{books.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
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
        </>
      )}
    </div>
  );
};

export default BooksPage;