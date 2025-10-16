import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface Author {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  price: number;
  img_url: string;
  authors: Author[];
}

interface BookContextType {
  books: Book[];
  getBooks: () => Promise<void>;
}

// 📘 สร้าง Context พร้อม type (เริ่มต้นเป็น null)
export const BookContext = createContext<BookContextType | null>(null);

// 📘 กำหนด props ของ Provider
interface BookProviderProps {
  children: ReactNode;
}

const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);

  // ✅ ดึงข้อมูลจาก backend
  const getBooks = async (): Promise<void> => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/books/");
      if (!response.ok) throw new Error("Failed to fetch books");

      const data: Book[] = await response.json();
      setBooks(data);
      console.log("📚 Books fetched:", data);
    } catch (error) {
      console.error("❌ Error fetching books:", error);
    }
  };

  useEffect(() => {
    getBooks(); // โหลดหนังสือตอนเริ่มต้น
  }, []);

  return (
    <BookContext.Provider value={{ books, getBooks }}>
      {children}
    </BookContext.Provider>
  );
};

export default BookProvider;
