import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { ServiceBasePath } from '@/config/service.paths';
import { useAuthState } from '@/stores/auth.store';
import { RoutePaths } from '@/config/route.paths';

const apiClient = axios.create({
  baseURL: ServiceBasePath,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthState.getState();
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
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
  (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      const { refreshToken, refreshAuthToken, logout } = useAuthState.getState();

      if (!refreshToken) {
        logout();
        window.location.href = RoutePaths.Login;
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return refreshAuthToken()
        .then(() => {
          const { accessToken: newAccessToken } = useAuthState.getState();
          
          if (newAccessToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue();
            return apiClient(originalRequest);
          } else {
            processQueue(new Error('Token refresh failed'));
            logout();
            window.location.href = RoutePaths.Login;
            return Promise.reject(new Error('No access token after refresh'));
          }
        })
        .catch((refreshError) => {
          processQueue(refreshError);
          logout();
          window.location.href = RoutePaths.Login;
          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return Promise.reject(error);
  }
);

export default apiClient;