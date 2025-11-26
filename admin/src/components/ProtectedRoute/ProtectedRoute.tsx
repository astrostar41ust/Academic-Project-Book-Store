import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, logout } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      logout();
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    logout();
    return <Navigate to="/login" replace />;
  }

  return children;
}
