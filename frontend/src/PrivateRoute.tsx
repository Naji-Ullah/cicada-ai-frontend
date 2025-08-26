import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

export default PrivateRoute;
