import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authorsAPI } from '../services/api';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Author } from '../types';

const AuthorBooksPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, loading: booksLoading } = useBooks();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await authorsAPI.getById(parseInt(id));
        setAuthor(response);
      } catch (err: any) {
        setError(err.message || 'Failed to load author details');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  // Filter books by author
  const authorBooks = books.filter((book) => {
    if (book.author?.id === parseInt(id || '0')) return true;
    if (book.authors?.some((a) => a.id === parseInt(id || '0'))) return true;
    return false;
  });

  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading || booksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4">
          <LoadingSpinner size="large" className="py-20" />
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error || 'Author not found'}
          </div>
          <button
            onClick={() => navigate('/authors')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Back to Authors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 pt-[120px]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/authors')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Authors
        </button>

        {/* Author Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Author Avatar */}
            <div
              className={`w-32 h-32 rounded-full ${getAvatarColor(
                author.name
              )} flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0`}
            >
              {getInitials(author.name)}
            </div>

            {/* Author Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">{author.name}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="font-medium">
                    {authorBooks.length} {authorBooks.length === 1 ? 'Book' : 'Books'} Published
                  </span>
                </div>

                <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  Author
                </span>
              </div>

              {author.biography && (
                <p className="text-gray-600 leading-relaxed">{author.biography}</p>
              )}
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Books by {author.name.split(' ')[0]}
          </h2>
          <p className="text-gray-600">
            Explore {authorBooks.length} amazing {authorBooks.length === 1 ? 'book' : 'books'} written by this author
          </p>
        </div>

        {/* Books Grid */}
        {authorBooks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mb-4">
              <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No books available</h3>
            <p className="text-gray-500 mb-4">This author hasn't published any books yet.</p>
            <button
              onClick={() => navigate('/books')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Browse All Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {authorBooks.map((book) => (
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

export default AuthorBooksPage;
