import axios from 'axios';
import type { Book, Author, User, AuthResponse, Address } from '../types';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Books API
export const booksAPI = {
  getAll: async (): Promise<Book[]> => {
    const response = await api.get('/books/');
    console.log(response)
    return response.data;
  },

  getRecommended: async (): Promise<Book[]> => {
    const response = await api.get('/books/recommended');
    return response.data;
  },

  getById: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    
    return response.data;
  },

  create: async (book: Omit<Book, 'id'>): Promise<Book> => {
    const response = await api.post('/books/', book);
    return response.data;
  },

  update: async (id: number, book: Partial<Book>): Promise<Book> => {
    const response = await api.put(`/books/${id}`, book);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};

// Authors API
export const authorsAPI = {
  getAll: async (): Promise<Author[]> => {
    const response = await api.get('/authors/');
    return response.data;
  },

  getById: async (id: number): Promise<Author> => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },

  create: async (author: Omit<Author, 'id'>): Promise<Author> => {
    const response = await api.post('/authors/', author);
    return response.data;
  },
};

// Address API
export const addressAPI = {
  getAll: async (): Promise<Address[]> => {
    const response = await api.get('/addresses');
    return response.data;
  },

  getById: async (id: number): Promise<Address> => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  create: async (address: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<Address> => {
    const response = await api.post('/addresses', address);
    return response.data;
  },

  update: async (id: number, address: Partial<Omit<Address, 'id' | 'user_id' | 'created_at'>>): Promise<Address> => {
    const response = await api.put(`/addresses/${id}`, address);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefault: async (id: number): Promise<Address> => {
    const response = await api.put(`/addresses/${id}/set-default`);
    return response.data;
  },
};

export default api;