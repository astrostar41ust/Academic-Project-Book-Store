import { createContext, useState, useContext } from "react";
import api from "../services/api"; // เรียก API

interface AuthContextType {
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const res = await api.post("/auth/login", { username, password });

      const tokenValue = res.data.access_token;
      localStorage.setItem("token", tokenValue);

      setToken(tokenValue);
      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
