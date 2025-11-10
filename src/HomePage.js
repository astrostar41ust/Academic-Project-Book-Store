import React from "react";
import { Link } from "react-router-dom";

const HomePage = ({ books }) => {
  return (
    <div>
      <h1>Book Store</h1>
      <div>
        {books.map((book) => (
          <div key={book.id}>
            <Link to={`/books/${book.id}`}>
              <h3>{book.title}</h3>
              {/* Optionally display more book info here */}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
