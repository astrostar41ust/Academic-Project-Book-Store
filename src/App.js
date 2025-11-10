import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetailsPage from "./pages/BookDetailsPage";

const App = () => {
  const books = [
    { id: 1, title: "Book One" },
    { id: 2, title: "Book Two" },
    { id: 3, title: "Book Three" },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage books={books} />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
