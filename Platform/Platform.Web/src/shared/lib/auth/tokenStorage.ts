import { STORAGE_KEYS } from '../../config/constants';

export interface StoredTokens {
  accessToken: string;
  accessTokenExpireAt: string;
  refreshToken: string;
  refreshTokenExpireAt: string;
}

/**
 * Tek sorumlu token persister. LocalStorage tabanlı.
 * Feature'lar doğrudan import etmez; `sessionStore` üzerinden erişilir.
 * httpClient interceptor'ı için salt-okunur `getAccessToken` açıktır.
 */
export const tokenStorage = {
  get(): StoredTokens | null {
    const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    const accessTokenExpireAt = localStorage.getItem(STORAGE_KEYS.accessTokenExpireAt);
    const refreshTokenExpireAt = localStorage.getItem(STORAGE_KEYS.refreshTokenExpireAt);

    if (!accessToken || !refreshToken || !accessTokenExpireAt || !refreshTokenExpireAt) {
      return null;
    }

    return { accessToken, refreshToken, accessTokenExpireAt, refreshTokenExpireAt };
  },

  set(tokens: StoredTokens): void {
    localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.accessTokenExpireAt, tokens.accessTokenExpireAt);
    localStorage.setItem(STORAGE_KEYS.refreshTokenExpireAt, tokens.refreshTokenExpireAt);
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.accessTokenExpireAt);
    localStorage.removeItem(STORAGE_KEYS.refreshTokenExpireAt);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.accessToken);
  },

  /** Access token süresi geçmiş mi? (yoksa "geçmiş" sayılır.) */
  isAccessTokenExpired(): boolean {
    const expireAt = localStorage.getItem(STORAGE_KEYS.accessTokenExpireAt);
    if (!expireAt) return true;
    return new Date(expireAt).getTime() <= Date.now();
  },

  /**
   * Oturum hâlâ canlı mı? Access token kısa ömürlü olabilir; gerçek "giriş yapılmış"
   * sinyali refresh token'ın süresinin geçmemiş olmasıdır (interceptor access'i yeniler).
   */
  hasLiveSession(): boolean {
    const tokens = this.get();
    if (!tokens) return false;
    return new Date(tokens.refreshTokenExpireAt).getTime() > Date.now();
  },
};
