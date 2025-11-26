import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';

type SortOption = 'title' | 'price-asc' | 'price-desc' | 'publication_date' | '';

const BooksPage: React.FC = () => {
  const { books, loading, error } = useBooks();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredAndSortedBooks.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  if (loading) {
    return (
      <>
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={(value) => setSortBy(value as SortOption)}
        />
        <div className="container mx-auto px-4 py-8 pt-[120px]">
          <LoadingSpinner size="large" className="py-20" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={(value) => setSortBy(value as SortOption)}
        />
        <div className="container mx-auto px-4 py-8 pt-[120px]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={(value) => setSortBy(value as SortOption)}
      />
      <div className="min-h-screen bg-gray-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">All Books</h1>
            
            {/* Results Info */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-800">{startIndex + 1}-{Math.min(endIndex, filteredAndSortedBooks.length)}</span> of <span className="font-semibold text-gray-800">{filteredAndSortedBooks.length}</span> book{filteredAndSortedBooks.length !== 1 ? 's' : ''}
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book}
                  onClick={() => navigate(`/books/${book.id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    const showEllipsis = 
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return (
                        <span key={page} className="px-4 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </>
  );
};

export default BooksPage;