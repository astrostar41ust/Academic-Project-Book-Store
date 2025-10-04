import { useState, useEffect } from 'react';
import type { Book } from '../types';
import { booksAPI } from '../services/api';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await booksAPI.getAll();
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (book: Omit<Book, 'id'>) => {
    try {
      const newBook = await booksAPI.create(book);
      setBooks(prev => [...prev, newBook]);
      return newBook;
    } catch (err) {
      setError('Failed to create book');
      throw err;
    }
  };

  const updateBook = async (id: number, book: Partial<Book>) => {
    try {
      const updatedBook = await booksAPI.update(id, book);
      setBooks(prev => prev.map(b => b.id === id ? updatedBook : b));
      return updatedBook;
    } catch (err) {
      setError('Failed to update book');
      throw err;
    }
  };

  const deleteBook = async (id: number) => {
    try {
      await booksAPI.delete(id);
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError('Failed to delete book');
      throw err;
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
  };
};