import { useMutation } from '@tanstack/react-query';
import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import { useSessionStore } from '../../../shared/lib/auth/sessionStore';
import type { AppError } from '../../../shared/types/ApiError';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  accessTokenExpireAt: string;
  refreshToken: string;
  refreshTokenExpireAt: string;
}

export function useLoginMutation() {
  const setAuthenticated = useSessionStore((s) => s.setAuthenticated);

  return useMutation<LoginResponse, AppError, LoginRequest>({
    mutationFn: async (payload) => {
      try {
        const response = await httpClient.post<LoginResponse>(ServicePath.Auth.Login, payload);
        return response.data;
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (tokens) => {
      setAuthenticated(tokens);
    },
  });
}
