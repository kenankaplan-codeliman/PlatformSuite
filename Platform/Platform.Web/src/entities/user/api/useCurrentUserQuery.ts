import { useQuery } from '@tanstack/react-query';
import { authKeys } from '../../../shared/api/queryKeys';
import { userDataSource } from './userDataSource';
import { useSessionStore } from '../../../shared/lib/auth/sessionStore';

export function useCurrentUserQuery() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: userDataSource.me,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });
}
