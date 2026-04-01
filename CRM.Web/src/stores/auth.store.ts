import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginResponse } from '@/types/auth.types';
import { authService } from '@/services/auth.sevice';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from "@/stores/process.state.store";



// JWT payload'dan expire tarihini çıkarır
const getTokenExpireAt = (token: string | null | undefined): string | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp
      ? new Date(payload.exp * 1000).toISOString()
      : null;
  } catch {
    return null;
  }
};

// ─── State Interface ──────────────────────────────────────────────────────────

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  accessTokenExpireAt: string | null;
  refreshToken: string | null;
  refreshTokenExpireAt: string | null;

  // Actions
  loadUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithMicrosoft: (msalToken: string) => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  setToken: (response: LoginResponse) => void;
  clearToken: () => void;
  logout: () => Promise<void>;

  // Helpers
  isAccessTokenExpired: () => boolean;
  isRefreshTokenExpired: () => boolean;
  checkAuth: () => Promise<boolean>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthState = create<AuthState>()(
  persist(
    (set, get) => ({

      // ── Initial state ────────────────────────────────────────────────────
      user: null,
      accessToken: null,
      accessTokenExpireAt: null,
      refreshToken: null,
      refreshTokenExpireAt: null,

      // ── Token helpers ────────────────────────────────────────────────────
      clearToken: () => {
        set({
          user: null,
          accessToken: null,
          accessTokenExpireAt: null,
          refreshToken: null,
          refreshTokenExpireAt: null,
        });
      },

      setToken: (response: LoginResponse) => {
        set({
          accessToken: response.accessToken,
          accessTokenExpireAt: getTokenExpireAt(response.accessToken),
          refreshToken: response.refreshToken,
          refreshTokenExpireAt: getTokenExpireAt(response.refreshToken),
        });
      },

      isAccessTokenExpired: () => {
        const { accessTokenExpireAt } = get();
        if (!accessTokenExpireAt) return true;
        return Date.now() >= new Date(accessTokenExpireAt).getTime();
      },

      isRefreshTokenExpired: () => {
        const { refreshTokenExpireAt } = get();
        if (!refreshTokenExpireAt) return true;
        return Date.now() >= new Date(refreshTokenExpireAt).getTime();
      },

      // ── Auth check ───────────────────────────────────────────────────────
      checkAuth: async () => {
        const { accessToken, isAccessTokenExpired, isRefreshTokenExpired, refreshAuthToken, logout } = get();

        if (!accessToken) return false;

        // Access token hâlâ geçerliyse devam et
        if (!isAccessTokenExpired()) return true;

        // Access token expired — refresh token geçerliyse yenile
        if (!isRefreshTokenExpired()) {
          try {
            await refreshAuthToken();
            return true;
          } catch {
            await logout();
            return false;
          }
        }

        // Her ikisi de expired — logout
        await logout();
        return false;
      },

      // ── User ─────────────────────────────────────────────────────────────
      loadUser: async () => {
        const { accessToken } = get();
        if (!accessToken) return;

        try {
          const response = await authService.fetchUser(accessToken!);
          set({ user: response });
        } catch { /* Kullanıcı bilgisi yüklenemedi — sessizce devam et */ }
      },

      // ── Auth actions ─────────────────────────────────────────────────────
      login: async (email, password) => {
        const { setState, clearState } = useProcessState.getState();
        const { setToken, clearToken } = get();

        try {
          setState(StateType.Loading, "Logging in", "Please wait...");
          const response = await authService.login(email, password);
          setToken(response);
          await get().loadUser();
          //setState(StateType.Success, "Login Successful", "You have been logged in successfully.");
          clearState();
        } catch (error) {
          clearToken();
          setState(StateType.Error, "Login Failed", handleError(error));
          throw error;
        }
      },

      loginWithMicrosoft: async (msalToken: string) => {
        const { setState, clearState } = useProcessState.getState();
        const { setToken, clearToken } = get();

        try {
          setState(StateType.Loading, "Logging in with Microsoft", "Please wait...");
          const response = await authService.loginWithMicrosoft(msalToken);
          setToken(response);
          await get().loadUser();
          clearState();
          //setState(StateType.Success, "Login Successful", "You have been logged in successfully.");
        } catch (error) {
          clearToken();
          setState(StateType.Error, 'Microsoft login failed', handleError(error));
          throw error;
        }
      },

      refreshAuthToken: async () => {
        const { setToken, clearToken, refreshToken, isRefreshTokenExpired } = get();

        // Refresh token yoksa veya expire olduysa direkt temizle
        if (!refreshToken || isRefreshTokenExpired()) {
          clearToken();
          return;
        }

        try {
          const response = await authService.refreshToken(refreshToken);
          setToken(response);
        } catch (error) {
          clearToken();
          throw error;
        }
      },

      logout: async () => {
        const { clearState } = useProcessState.getState();
        const { accessToken, clearToken } = get();

        clearToken();
        clearState();

        // sessionStorage.clear() yerine yalnızca MSAL önbelleğini temizle.
        // Diğer oturum verilerini (varsa) korur.
        Object.keys(sessionStorage)
          .filter((key) => key.startsWith('msal.'))
          .forEach((key) => sessionStorage.removeItem(key));

        localStorage.removeItem('crm-auth-state');

        if (accessToken) {
          authService.logout(accessToken).catch(() => { });
        }
      },

    }),
    {
      name: 'crm-auth-state',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        accessTokenExpireAt: state.accessTokenExpireAt,
        refreshToken: state.refreshToken,
        refreshTokenExpireAt: state.refreshTokenExpireAt
      }),
    }
  )
);