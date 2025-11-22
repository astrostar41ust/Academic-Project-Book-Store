import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: { value: string; label: string }[];
  placeholder?: string;
  showSort?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy = '',
  onSortChange,
  sortOptions = [
    { value: '', label: 'Sort by...' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'publication_date', label: 'Newest First' },
  ],
  placeholder = 'Search...',
  showSort = true,
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full pl-9 ${showSort && onSortChange ? 'pr-12' : 'pr-4'} py-2 text-sm border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white text-gray-800 placeholder-gray-400`}
      />
      {/* Sort Icon Button */}
      {showSort && onSortChange && (
        <div className="absolute inset-y-0 right-1 flex items-center">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-9 w-10 px-0 text-xs border-0 rounded-md focus:outline-none bg-gray-100 hover:bg-gray-200 text-transparent cursor-pointer font-medium"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '20px',
              }}
              title={sortBy ? `Sorting: ${sortBy}` : 'Sort options'}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-white text-gray-700">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
