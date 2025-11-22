// Types definitions for the BookStore application

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Address {
  id: number;
  user_id: number;
  label: string;
  recipient_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  district: string;
  sub_district: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  created_at?: string;
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
  book_count?: number;
}

export interface Book {
  id: number;
  title: string;
  isbn?: string;
  price: number;
  publication_date: string;
  stock_quantity: number;
  is_recommended?: boolean;
  author_id?: number;
  author?: Author;
  authors?: Author[];
  img_url: string;
  file_url?: string;
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