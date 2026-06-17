import { create } from 'zustand';
import { tokenStorage, type StoredTokens } from './tokenStorage';

/**
 * Paylaşılan auth session state'i.
 * Yalnızca "kullanıcı authenticated mi?" bilgisini tutar.
 * Kullanıcı detayları (`ClientUserInfo`) `useCurrentUserQuery` (TanStack) üzerinden gelir.
 */
interface SessionState {
  isAuthenticated: boolean;
  setAuthenticated: (tokens: StoredTokens) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: tokenStorage.hasLiveSession(),
  setAuthenticated: (tokens) => {
    tokenStorage.set(tokens);
    set({ isAuthenticated: true });
  },
  clear: () => {
    tokenStorage.clear();
    set({ isAuthenticated: false });
  },
}));
