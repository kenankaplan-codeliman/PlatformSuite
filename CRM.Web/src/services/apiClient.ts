import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { useAuthState } from '@/stores/auth.store';
import { authService } from '@/services/auth.sevice';

/**
 * Axios instance with authentication interceptor
 * Automatically adds Authorization header to all requests
 * Handles token refresh on 401 errors
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Adds Authorization header with access token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    
    const { accessToken } = useAuthState.getState();
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Response interceptor
 * Handles token refresh on 401 Unauthorized
 */
/*
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, setTokens, logout } = useAuthState();

      if (!refreshToken) {
        // No refresh token, logout
        logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Try to refresh token
        const response = await authService.refreshAccessToken(refreshToken);
        
        // Update tokens in store
        setTokens(response.accessToken, response.refreshToken);
        
        // Update Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
        }
        
        // Process queued requests
        processQueue();
        
        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        processQueue(refreshError);
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
*/


