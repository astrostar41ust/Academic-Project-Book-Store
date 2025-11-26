import axios from "axios";
import type { Book, Author, User, AuthResponse } from "../types";

const API_BASE_URL = "http://127.0.0.1:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get("/users/");
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateRole: async (id: number, role_id: number): Promise<{ msg: string }> => {
    const response = await api.put(`/users/${id}/role`, { role_id });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },

  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

// Books API
export const booksAPI = {
  getAll: async (): Promise<Book[]> => {
    const response = await api.get("/books/");
    console.log(response);
    return response.data;
  },

  getById: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);

    return response.data;
  },

  create: async (book: Omit<Book, "id">): Promise<Book> => {
    const response = await api.post("/books/", book);
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
    const response = await api.get("/authors/");
    return response.data;
  },

  getById: async (id: number): Promise<Author> => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },

  create: async (author: Omit<Author, "id">): Promise<Author> => {
    const response = await api.post("/authors/", author);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/authors/${id}`);
  },
};

export default api;
