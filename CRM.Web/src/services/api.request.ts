import { useAuthState } from '@/stores/auth.store';

let refreshPromise: Promise<void> | null = null;
let isLoggingOut = false;

const safeLogout = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  useAuthState.getState().logout().finally(() => {
    isLoggingOut = false;
  });
};

/**
 * Business servis çağrılarını saran wrapper.
 * 401 alınırsa token'ı yeniler ve isteği tekrar çalıştırır.
 *
 * Kullanım:
 *   return apiRequest(() => apiClient.post<T>(url, body).then(r => r.data));
 */
export const apiRequest = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (error: any) {

    // 401 değilse direkt fırlat
    if (error?.response?.status !== 401) throw error;

    const { refreshToken, refreshAuthToken } = useAuthState.getState();

    // Refresh token yoksa logout
    if (!refreshToken) {
      safeLogout();
      throw error;
    }

    try {
      // Eş zamanlı çağrılar aynı refresh promise'i beklesin
      if (!refreshPromise) {
        refreshPromise = refreshAuthToken().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;

      // Token yenilendi — request interceptor yeni token'ı otomatik ekler
      return await request();

    } catch {
      safeLogout();
      throw error;
    }
  }
};
