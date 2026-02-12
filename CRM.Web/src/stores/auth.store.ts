import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginResponse } from '@/types/auth.types';
import { authService } from '@/services/auth.sevice';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from "@/stores/process.state.store";

interface AuthState {
    // State
    user: User | null;
    accessToken: string | null;
    accessTokenExpireAt: string | null; // ISO date string
    refreshToken: string | null;
    isAuthenticated: boolean;


    // Actions
    loadUser: () => void;
    login: (email: string, password: string) => Promise<void>;
    loginWithMicrosoft: (msalToken: string) => Promise<void>;
    refreshAuthToken: () => Promise<void>;

    setToken: (response: LoginResponse) => void;
    clearToken: () => void;

    logout: () => void;

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

            // Actions
            clearToken: () => {
                set({
                    user: null,
                    accessToken: null,
                    accessTokenExpireAt: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            setToken: (response: LoginResponse) => {
                const expireAtStr = convertExpireAtString(response.accessTokenExpireAt);
                set({
                    accessToken: response.accessToken,
                    accessTokenExpireAt: expireAtStr,
                    refreshToken: response.refreshToken ?? null,
                    isAuthenticated: true,
                });
            },

            loadUser: async () => {
                const { setState } = useProcessState.getState();
                const { accessToken } = get();

                setState(StateType.Loading, "Initializing user", "Please wait...");

                try {
                    const response = await authService.fetchUser(accessToken!);

                    set({
                        user: response
                    });

                    setState(StateType.Success, "User loaded", "User information has been loaded successfully.");

                } catch (error) {
                    const errorMessage = handleError(error);
                    setState(StateType.Error, "User loading failed", errorMessage);
                }

            },

            login: async (email, password) => {

                const { setState } = useProcessState.getState();
                const { setToken, clearToken } = get();

                try {
                    setState(StateType.Loading, "Logging in", "Please wait...");

                    const response = await authService.login(email, password)

                    setToken(response);

                    setState(StateType.Success, "Login Successful", "You have been logged in successfully.");

                } catch (error) {
                    clearToken();
                    const errorMessage = handleError(error);
                    setState(StateType.Error, "Login Failed", errorMessage);
                }

            },

            loginWithMicrosoft: async (msalToken: string) => {

                const { setState } = useProcessState.getState();
                const { setToken, clearToken } = get();



                try {
                    setState(StateType.Loading, "Logging in with Microsoft", "Please wait...");

                    const response = await authService.loginWithMicrosoft(msalToken);

                    setToken(response);

                    setState(StateType.Success, "Login Successful", "You have been logged in successfully.");
                } catch (error) {
                    clearToken();
                    const errorMessage = handleError(error);
                    setState(StateType.Error, 'Microsoft login failed', errorMessage);
                }
            },

            refreshAuthToken: async () => {
                const { setState } = useProcessState.getState();
                const { setToken, clearToken, refreshToken } = get();



                try {
                    // Check if refreshToken is available
                    if (!refreshToken) {
                        clearToken();
                        return;
                    }

                    setState(StateType.Loading, "Refreshing token", "Please wait...");

                    // Implement token refresh logic here
                    const response = await authService.refreshToken(refreshToken);

                    setToken(response);

                    setState(StateType.Success, "Token refreshed", "Your session has been extended.");
                } catch (error) {
                    clearToken();
                    const errorMessage = handleError(error);
                    setState(StateType.Error, 'Token refresh failed', errorMessage);
                    throw error;
                }
            },

            logout: async () => {
                const { setState } = useProcessState.getState();
                const { accessToken, clearToken } = get();

                try {
                    if (accessToken != null) {
                        setState(StateType.Loading, "Logging out", "Please wait...");

                        await authService.logout(accessToken!);

                        setState(StateType.Success, 'Logout Successful', 'You have been logged out successfully.');
                    }
                } catch (error) {
                    const errorMessage = handleError(error);
                    setState(StateType.Error, 'Logout failed', errorMessage);
                }
                finally {
                    clearToken();
                    // 2. Storage'ı temizle
                    sessionStorage.clear();
                    localStorage.removeItem('crm-auth-state');
                }

            },

            // Token expire kontrolü
            isTokenExpired: () => {
                const { accessTokenExpireAt } = get();

                // Token yoksa expire kabul et
                if (!accessTokenExpireAt) return true;

                const expireTime = new Date(accessTokenExpireAt).getTime();
                const now = Date.now();

                return now >= expireTime;
            },

            // Auth kontrolü - expire olduysa logout yapar
            checkAuth: () => {
                const { isAuthenticated, isTokenExpired, logout, refreshAuthToken } = get();

                // Authenticate değilse zaten false
                if (!isAuthenticated) return false;

                // Token expire olduysa logout yap
                if (isTokenExpired()) {
                    refreshAuthToken()
                }
                else
                    return true;

                if (isTokenExpired()) {
                    logout();
                    return false;
                }
                else
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


// Utility function to convert expireAt to ISO string
const convertExpireAtString = (accessTokenExpireAt: any) => {
    const expireAtStr = accessTokenExpireAt instanceof Date
        ? accessTokenExpireAt.toISOString()
        : accessTokenExpireAt;

    return expireAtStr;
};