import { useState, useEffect } from 'react';
import type { Author } from '../types';
import { authorsAPI } from '../services/api';

export const useAuthors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authorsAPI.getAll();
      setAuthors(data);
    } catch (err) {
      setError('Failed to fetch authors');
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAuthor = async (author: Omit<Author, 'id'>) => {
    try {
      const newAuthor = await authorsAPI.create(author);
      setAuthors(prev => [...prev, newAuthor]);
      return newAuthor;
    } catch (err) {
      setError('Failed to create author');
      throw err;
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return {
    authors,
    loading,
    error,
    fetchAuthors,
    createAuthor,
  };
};