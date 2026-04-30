import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSessionStore } from '../../../shared/lib/auth/sessionStore';
import { RoutePaths } from '../paths';

export interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Authenticated olmayan kullanıcıları `/auth/login`'e yönlendirir.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={RoutePaths.Login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
