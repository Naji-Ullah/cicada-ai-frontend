import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Fix import
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
  const navigate = useNavigate(); // Add navigation hook

  useEffect(() => {
    if (!hasCheckedAuth.current && !isLoggingOut) {
      checkAuthStatus();
      hasCheckedAuth.current = true;
    }
  }, [isLoggingOut]);

  useEffect(() => {
    console.log('AuthContext: user state:', user); // Debug
  }, [user]);

 const checkAuthStatus = async () => {
  if (isLoggingOut) {
    setIsLoading(false);
    return;
  }

  try {
    const userData = await apiService.getProfile();
    console.log('checkAuthStatus: userData:', userData);
    setUser(userData);
  } catch (error) {
    console.log('User not authenticated:', error);
    setUser(null);
  } finally {
    setIsLoading(false);
  }
};

const login = async (username: string, password: string) => {
  try {
    const response = await apiService.login({ username, password });

    localStorage.setItem("access", response.access);
    localStorage.setItem("refresh", response.refresh);

    const userData = await apiService.getProfile();
    setUser(userData);

    navigate('/dashboard');
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
      console.log('register: response:', response);
      setUser(response.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await apiService.logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      setIsLoggingOut(false);
      navigate('/auth');
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