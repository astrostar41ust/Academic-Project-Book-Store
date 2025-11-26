import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthors } from '../hooks/useAuthors';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';


const AuthorsPage: React.FC = () => {
  const { authors, loading, error } = useAuthors();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "books">("name");

  // Filter and sort authors
  const filteredAndSortedAuthors = useMemo(() => {
    let filtered = authors.filter((author) => {
      const searchLower = searchQuery.toLowerCase();
      return author.name.toLowerCase().includes(searchLower);
    });

    // Sort
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "books":
        filtered.sort((a, b) => (b.book_count || 0) - (a.book_count || 0));
        break;
    }

    return filtered;
  }, [authors, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("name");
  };

  // Generate avatar color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-red-400 to-red-600",
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
      "bg-gradient-to-br from-teal-400 to-teal-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get initials from name
  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <>
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={(value) => setSortBy(value as 'name' | 'books')}
          sortOptions={[
            { value: 'name', label: 'Sort by Name (A-Z)' },
            { value: 'books', label: 'Sort by Books Count' },
          ]}
          searchPlaceholder="Search authors by name..."
        />
        <div className="min-h-screen bg-gray-50 py-8 pt-[120px]">
          <div className="container mx-auto px-4">
            <LoadingSpinner size="large" className="py-20" />
          </div>
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
          onSortChange={(value) => setSortBy(value as 'name' | 'books')}
          sortOptions={[
            { value: 'name', label: 'Sort by Name (A-Z)' },
            { value: 'books', label: 'Sort by Books Count' },
          ]}
          searchPlaceholder="Search authors by name..."
        />
        <div className="min-h-screen bg-gray-50 py-8 pt-[120px]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
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
        onSortChange={(value) => setSortBy(value as 'name' | 'books')}
        sortOptions={[
          { value: 'name', label: 'Sort by Name (A-Z)' },
          { value: 'books', label: 'Sort by Books Count' },
        ]}
        searchPlaceholder="Search authors by name..."
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Authors</h1>
            <p className="text-gray-600">
              Discover talented writers and explore their literary works
            </p>
          </div>

          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {filteredAndSortedAuthors.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">
                {authors.length}
              </span>{" "}
              authors
            </p>
            {(searchQuery || sortBy !== "name") && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Filters
              </button>
            )}
          </div>

        {/* Authors Grid */}
        {filteredAndSortedAuthors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mb-4">
              <svg
                className="w-20 h-20 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No authors found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedAuthors.map((author) => (
              <div
                key={author.id}
                onClick={() => navigate(`/authors/${author.id}/books`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    {author.image_url ? (
                      <img
                        src={author.image_url}
                        alt={author.name}
                        className="w-24 h-24 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className={`w-24 h-24 rounded-full ${getAvatarColor(
                          author.name
                        )} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {getInitials(author.name)}
                      </div>
                    )}
                  </div>

                  {/* Author Info */}
                  <div className="text-center flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem] flex items-center justify-center line-clamp-2 px-2">
                      {author.name}
                    </h3>

                    {/* Books Count */}
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        {author.book_count || 0}{" "}
                        {author.book_count === 1 ? "Book" : "Books"}
                      </span>
                    </div>

                    {/* View Button */}
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium shadow-md group-hover:shadow-lg mt-auto">
                      View Books
                    </button>
                  </div>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 group-hover:h-3 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {authors.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {authors.length}
              </div>
              <div className="text-gray-600 font-medium">Total Authors</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {authors.reduce(
                  (sum, author) => sum + (author.book_count || 0),
                  0
                )}
              </div>
              <div className="text-gray-600 font-medium">Total Books</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">
                {authors.length > 0
                  ? Math.round(
                      authors.reduce(
                        (sum, author) => sum + (author.book_count || 0),
                        0
                      ) / authors.length
                    )
                  : 0}
              </div>
              <div className="text-gray-600 font-medium">Avg Books/Author</div>
            </div>
          </div>
        )}
      </div>
</div>
    </>
  );
};

export default AuthorsPage;
