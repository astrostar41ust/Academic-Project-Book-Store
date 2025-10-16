import { useState } from "react";
import SideBar from "./components/sidebar/earth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BooksPage from "./pages/BookPage";
import BookProvider from "./context/BookContext";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ToastContainer />
        <SideBar>
          <BookProvider>
            <Routes>
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="/bookpage" element={<BooksPage />} />
            </Routes>
          </BookProvider>
        </SideBar>
      </div>
    </Router>
  );
}

export default App;
