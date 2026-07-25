import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'ADMIN' | 'USER';
}

export default function ProtectedRoute({ requiredRole = 'USER' }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login, and save their current location
    // so they can be redirected back after logging in
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Basic role logic: if a route requires ADMIN but user is not admin, 
  // you would redirect them here. For now, since user.role isn't fully 
  // modeled in AuthContext, we just check if they are logged in.
  
  return <Outlet />;
}
