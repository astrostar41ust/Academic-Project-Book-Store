import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';

type SortOption = 'title' | 'price-asc' | 'price-desc' | 'publication_date' | '';

const BooksPage: React.FC = () => {
  const { books, loading, error } = useBooks();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('');

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((book) => {
        const titleMatch = book.title.toLowerCase().includes(query);
        const authorMatch = book.author?.name.toLowerCase().includes(query);
        return titleMatch || authorMatch;
      });
    }

    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'price-asc':
            return a.price - b.price; // Low to High
          case 'price-desc':
            return b.price - a.price; // High to Low
          case 'publication_date':
            const dateA = new Date(a.publication_date).getTime();
            const dateB = new Date(b.publication_date).getTime();
            return dateB - dateA; // Newest first
          default:
            return 0;
        }
      });
    }

    return result;
  }, [books, searchQuery, sortBy]);

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
    <div className="min-h-screen bg-gray-50 py-8 pt-[120px]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">All Books</h1>
          
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by book title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="md:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Sort by...</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="publication_date">Newest First</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Found <span className="font-semibold text-gray-800">{filteredAndSortedBooks.length}</span> book{filteredAndSortedBooks.length !== 1 ? 's' : ''}
                {searchQuery && (
                  <span className="ml-1">
                    for "<span className="font-semibold text-blue-600">{searchQuery}</span>"
                  </span>
                )}
              </p>
              {(searchQuery || sortBy) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSortBy('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredAndSortedBooks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `We couldn't find any books matching "${searchQuery}"`
                : "No books are available at the moment"
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book}
                onClick={() => navigate(`/books/${book.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;