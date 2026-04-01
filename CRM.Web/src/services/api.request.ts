import axios from 'axios';
import { useAuthState } from '@/stores/auth.store';

const REFRESH_TIMEOUT_MS = 10_000;

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
 * Promise'i verilen süre içinde tamamlanmaya zorlar.
 * Süre aşılırsa reject eder — asıl promise arka planda çalışmaya devam eder
 * ancak sonucu artık dikkate alınmaz.
 */
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Token yenileme ${ms / 1000}s içinde tamamlanamadı`)),
        ms,
      )
    ),
  ]);

/**
 * Business servis çağrılarını saran wrapper.
 * 401 alınırsa token'ı yeniler ve isteği tekrar çalıştırır.
 * Refresh isteği REFRESH_TIMEOUT_MS içinde tamamlanamazsa logout tetiklenir.
 *
 * Kullanım:
 *   return apiRequest(() => apiClient.post<T>(url, body).then(r => r.data));
 */
export const apiRequest = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (error: unknown) {

    // 401 değilse direkt fırlat
    if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;

    const { refreshToken, refreshAuthToken } = useAuthState.getState();

    // Refresh token yoksa logout
    if (!refreshToken) {
      safeLogout();
      throw error;
    }

    try {
      // Eş zamanlı çağrılar aynı refresh promise'i beklesin.
      // withTimeout, asılı kalan refresh'in tüm istekleri bloke etmesini önler.
      if (!refreshPromise) {
        refreshPromise = withTimeout(refreshAuthToken(), REFRESH_TIMEOUT_MS).finally(() => {
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
