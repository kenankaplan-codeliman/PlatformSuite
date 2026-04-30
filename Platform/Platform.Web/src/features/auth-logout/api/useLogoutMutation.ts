import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import { useSessionStore } from '../../../shared/lib/auth/sessionStore';
import { tokenStorage } from '../../../shared/lib/auth/tokenStorage';

export function useLogoutMutation() {
  const clear = useSessionStore((s) => s.clear);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const tokens = tokenStorage.get();
      if (!tokens?.accessToken) return;
      try {
        await httpClient.post(ServicePath.Auth.Logout, { accessToken: tokens.accessToken });
      } catch {
        // Logout backend çağrısı başarısız olsa bile lokal temizlik yapılır
      }
    },
    onSettled: () => {
      clear();
      queryClient.clear();
    },
  });
}
