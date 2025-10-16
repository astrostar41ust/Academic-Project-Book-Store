import React, { useContext } from "react";
import { BookContext } from "../context/BookContext";
import { ToastContainer, toast } from "react-toastify";

const BookPage: React.FC = () => {
  const context = useContext(BookContext);

  if (!context) return <div>Loading...</div>;

  const { books } = context;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="border rounded-lg p-4 shadow hover:shadow-lg"
        >
          <img
            src={book.img_url}
            alt={book.title}
            className="w-full h-60 object-cover rounded-md mb-3"
          />
          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className="text-gray-500 text-sm">
            by {book.authors.map((a) => a.name).join(", ")}
          </p>
          <p className="text-blue-600 font-bold mt-2">
            ${book.price.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BookPage;
