/** Generic kullanıcı tercihi — Platform.Application UserPreferenceItem ile birebir. */
export interface UserPreferenceItem {
  key: string;
  /** Opak JSON value; hiç kayıt yoksa null. */
  value: string | null;
}
