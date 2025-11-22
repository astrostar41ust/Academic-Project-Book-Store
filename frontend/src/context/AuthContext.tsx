import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse } from '../types';
import { authAPI } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.access_token,
        isAuthenticated: true,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  isAuthenticated: !!localStorage.getItem('token'),
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is still authenticated on app start
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({ type: 'SET_LOADING', payload: true });
      authAPI.getProfile()
        .then((user) => {
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { access_token: token, user }
          });
        })
        .catch(() => {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGIN_ERROR' });
        });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.login(username, password);
      localStorage.setItem('token', response.access_token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.register(username, email, password);
      localStorage.setItem('token', response.access_token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    
    // Don't delete user cart from localStorage - just logout
    // Cart will be loaded back when user logs in again
    
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider 
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};