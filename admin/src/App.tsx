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
import AuthorPage from "./pages/author/AuthorPage";
import UserManage from "./pages/user_manage/UserManage";
import Profile from "./pages/user_manage/Profile";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/bookpage" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/bookpage" replace /> : <LoginPage />
        }
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
      <Route
        path="/authors"
        element={
          <ProtectedRoute>
            <SideBar>
              <AuthorPage />
            </SideBar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/usermanage"
        element={
          <ProtectedRoute>
            <SideBar>
              <UserManage />
            </SideBar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <SideBar>
              <Profile />
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
