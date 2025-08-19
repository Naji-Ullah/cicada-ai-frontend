import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { apiService, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth.current && !isLoggingOut) {
      checkAuthStatus();
      hasCheckedAuth.current = true;
    }
  }, [isLoggingOut]);

  const checkAuthStatus = async () => {
    if (isLoggingOut) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await apiService.getProfile();
      setUser(userData);
    } catch (error) {
      console.log('User not authenticated');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await apiService.login({ username, password });
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const response = await apiService.register({ 
        username, 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName 
      });
      setUser(response.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      
      await apiService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      
      localStorage.clear();
      sessionStorage.clear();
      
      setIsLoggingOut(false);
      
      window.location.reload();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};