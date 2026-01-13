import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthResponse, LoginRequest, RegisterRequest, GoogleAuthRequest } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithGoogle: (request: GoogleAuthRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
  isProvider: boolean;
  isClient: boolean;
  isAdmin: boolean;
  isGod: boolean;
  isVerified: boolean;
  needsVerification: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData: User = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to parse stored user');
          }
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response: AuthResponse = await authService.login(credentials);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const loginWithGoogle = async (request: GoogleAuthRequest): Promise<void> => {
    const response: AuthResponse = await authService.googleAuth(request);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    const response: AuthResponse = await authService.register(data);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // ✅ ตรวจสอบ role อย่างถูกต้อง
  const isVerified = user?.verification_status === 'verified' || user?.verification_status === 'approved';
  const isGod = (user && 'user_type' in user && user.user_type === 'god') || user?.tier_name?.toLowerCase() === 'god';
  const isAdmin = (user && 'user_type' in user && user.user_type === 'admin') || (user && 'is_admin' in user && user.is_admin === true);
  const needsVerification = !!user && !isVerified && !isGod && !isAdmin;

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isProvider: user?.role === 'provider',
    isClient: user?.role === 'client',
    isAdmin,
    isGod,
    isVerified,
    needsVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
