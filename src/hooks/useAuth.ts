import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext';
import { Role } from '@/data/mockData';

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  const { user, loading } = useAuth();
  return !loading && !!user;
};

/**
 * Hook to check if user has a specific role
 */
export const useHasRole = (requiredRole: Role) => {
  const { role, loading } = useAuth();
  return !loading && role === requiredRole;
};

/**
 * Hook to check if user has any of the specified roles
 */
export const useHasAnyRole = (roles: Role[]) => {
  const { role, loading } = useAuth();
  return !loading && role && roles.includes(role);
};
