import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    email: string;
    displayName: string;
    profilePictureUrl?: string;
    organizationId: string;
    organizationName: string;
}

interface AuthState {
    // State
    user: User | null;
    accessToken: string | null;
    accessTokenExpireAt: string | null; // ISO date string
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: User) => void;
    login: (
        user: User,
        accessToken: string,
        accessTokenExpireAt: string | Date,
        refreshToken?: string
    ) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;

    // Helpers
    isTokenExpired: () => boolean;
    checkAuth: () => boolean; // Token geçerliyse true, expire olduysa logout yapıp false döner
}

export const useAuthState = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            accessToken: null,
            accessTokenExpireAt: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,

            // Actions
            setUser: (user) => set({ user }),

            login: (user, accessToken, accessTokenExpireAt, refreshToken) => {
                // Date objesi geldiyse ISO string'e çevir
                const expireAtStr = accessTokenExpireAt instanceof Date
                    ? accessTokenExpireAt.toISOString()
                    : accessTokenExpireAt;

                set({
                    user,
                    accessToken,
                    accessTokenExpireAt: expireAtStr,
                    refreshToken: refreshToken ?? null,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                // 1. State'i temizle
                set({
                    user: null,
                    accessToken: null,
                    accessTokenExpireAt: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });

                // 2. Storage'ı temizle
                sessionStorage.clear();
                localStorage.removeItem('crm-auth-state');
            },

            setLoading: (loading) => set({ isLoading: loading }),

            // Token expire kontrolü
            isTokenExpired: () => {
                const { accessTokenExpireAt } = get();

                // Token yoksa expire kabul et
                if (!accessTokenExpireAt) return true;

                // Expire tarihini kontrol et (1 dakika buffer ekle)
                const expireTime = new Date(accessTokenExpireAt).getTime();
                const now = Date.now();
                const bufferMs = 60 * 1000; // 1 dakika buffer

                return now >= expireTime - bufferMs;
            },

            // Auth kontrolü - expire olduysa logout yapar
            checkAuth: () => {
                const { isAuthenticated, isTokenExpired, logout } = get();

                // Authenticate değilse zaten false
                if (!isAuthenticated) return false;

                // Token expire olduysa logout yap
                if (isTokenExpired()) {
                    logout();
                    return false;
                }

                return true;
            },
        }),
        {
            name: 'crm-auth-state',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                accessTokenExpireAt: state.accessTokenExpireAt,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);