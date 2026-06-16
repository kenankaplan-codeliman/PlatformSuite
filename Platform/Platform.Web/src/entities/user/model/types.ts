/** Backend `Platform.Domain.Enums.AccessLevel` ile uyumlu (string serialize). */
export type AccessLevel = 'None' | 'User' | 'Organization' | 'All';

/**
 * Backend `Platform.Application.Modals.Authentication.ClientUserInfo` ile uyumlu.
 */
export interface ClientUserInfo {
  email: string;
  displayName: string;
  /** Privilege kodu → erişim seviyesi. Örn. `{ "Lead.Read": "Organization" }`. */
  privileges: Record<string, AccessLevel>;
}
