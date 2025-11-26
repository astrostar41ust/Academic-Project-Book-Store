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

export const BookContext = createContext<BookContextType | null>(null);

interface BookProviderProps {
  children: ReactNode;
}

const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);

  const getBooks = async (): Promise<void> => {
    try {
      const response = await fetch("/api/books/");
      if (!response.ok) throw new Error("Failed to fetch books");

      const data: Book[] = await response.json();
      setBooks(data);
      console.log("Books fetched:", data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    getBooks(); 
  }, []);

  return (
    <BookContext.Provider value={{ books, getBooks }}>
      {children}
    </BookContext.Provider>
  );
};

export default BookProvider;
