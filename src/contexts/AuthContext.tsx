import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to check if stored token is valid
  const checkAuthStatus = async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');
    
    if (!storedToken || !storedUser) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
    
    try {
      // Validate token with a backend call if you have an endpoint for this
      // For now, we'll just check if the token exists and parse the user
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      // Clear invalid tokens
      logout();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
    localStorage.setItem('adminToken', userToken);
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated, 
        login, 
        logout,
        checkAuthStatus,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;