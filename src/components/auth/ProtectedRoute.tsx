import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, checkAuthStatus, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthStatus();
      setIsChecking(false);
    };
    
    verifyAuth();
  }, [location.pathname]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-10 w-10 rounded-full border-4 border-sky-500 border-r-transparent animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;