import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import SideBar from "./components/sidebar/earth";
import BooksPage from "./pages/book/BookPage";
import BookProvider from "./context/BookContext";
import LoginPage from "./pages/auth/LoginPage";

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/bookpage" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={token ? <Navigate to="/bookpage" replace /> : <LoginPage />}
      />

      <Route
        path="/bookpage"
        element={
          <ProtectedRoute>
            <SideBar>
              <BookProvider>
                <BooksPage />
              </BookProvider>
            </SideBar>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
