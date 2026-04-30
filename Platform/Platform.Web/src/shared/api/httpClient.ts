import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { tokenStorage } from '../lib/auth/tokenStorage';
import { useSessionStore } from '../lib/auth/sessionStore';
import { ServicePath } from './servicePaths';

/**
 * Uygulama genelinde kullanılan tek axios instance'ı.
 * - Authorization header otomatik eklenir.
 * - 401 yakalanınca refresh dener; başarısızsa session temizlenir.
 * - Feature/entity DataSource'ları bu client üzerinden API'ye gider.
 */

let refreshInFlight: Promise<string | null> | null = null;

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpireAt: string;
  refreshToken: string;
  refreshTokenExpireAt: string;
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(ServicePath.Auth.Refresh) &&
      !originalRequest.url?.includes(ServicePath.Auth.Login)
    ) {
      originalRequest._retry = true;

      const newToken = await tryRefreshAccessToken();
      if (newToken) {
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        return httpClient(originalRequest);
      }

      useSessionStore.getState().clear();
    }

    return Promise.reject(error);
  },
);

/**
 * Paralel 401'lerde aynı anda birden fazla refresh çağrısı yapılmasın diye
 * tek bir in-flight promise queue'lanır.
 */
async function tryRefreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  const tokens = tokenStorage.get();
  if (!tokens?.refreshToken) {
    return null;
  }

  refreshInFlight = (async () => {
    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${env.apiBaseUrl}${ServicePath.Auth.Refresh}`,
        { refreshToken: tokens.refreshToken },
      );
      tokenStorage.set(response.data);
      return response.data.accessToken;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}
