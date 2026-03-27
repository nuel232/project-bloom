import { Navigate } from 'react-router-dom';
import { useAuth, useHasAnyRole } from '@/hooks/useAuth';
import { Role } from '@/data/mockData';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
}

/**
 * Component to protect routes based on authentication
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
}) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(role as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

/**
 * Component to check if user has permission to view a route
 */
export const RoleBasedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
}) => {
  const { user, loading } = useAuth();
  const hasRole = useHasAnyRole(requiredRoles);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
