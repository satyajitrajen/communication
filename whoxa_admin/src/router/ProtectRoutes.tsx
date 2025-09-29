// components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  children?: ReactNode; // Accept children prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get('adminToken'); // Check if token exists
  const location = useLocation();
  

  // If not authenticated, redirect to login page
  if (!token) {
    return <Navigate to="/admin/auth/Login" state={{ from: location }} />;
  }

  // Render the children components if authenticated
  return <>{children}</>; // Render children inside a fragment
};

export default ProtectedRoute;
