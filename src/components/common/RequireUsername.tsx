import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from './Loading';

interface RequireUsernameProps {
  children: ReactNode;
}

const ALLOWED_PATHS = ['/enter', '/setup'];

export function RequireUsername({ children }: RequireUsernameProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  // Not authenticated - allow access (other guards handle auth)
  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  // User has username set - allow access
  if (user.username) {
    return <>{children}</>;
  }

  // User is authenticated but has no username
  // Allow access to /enter and /setup
  if (ALLOWED_PATHS.some((path) => location.pathname.startsWith(path))) {
    return <>{children}</>;
  }

  // Redirect to /setup
  return <Navigate to="/setup" replace state={{ from: location }} />;
}
