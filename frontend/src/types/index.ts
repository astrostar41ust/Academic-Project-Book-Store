// Types definitions for the BookStore application

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface Role {
  id: number;
  name: 'admin' | 'customer';
}

export interface Author {
  id: number;
  name: string;
  biography?: string;
  birth_date?: string;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  price: number;
  publication_date: string;
  stock_quantity: number;
  author_id: number;
  author?: Author;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  msg?: string;
  error?: string;
}