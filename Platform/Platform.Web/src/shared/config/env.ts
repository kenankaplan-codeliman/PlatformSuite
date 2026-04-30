/**
 * Runtime environment konfigürasyonu.
 * `.env` dosyasından Vite tarafından inject edilir.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
} as const;
