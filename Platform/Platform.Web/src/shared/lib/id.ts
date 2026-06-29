/**
 * Güvenli-bağlam-bağımsız UUID v4 üreteci.
 *
 * `crypto.randomUUID()` yalnızca **secure context**'te (HTTPS veya localhost)
 * tanımlıdır; HTTP üzerinden sunulan dağıtımlarda `undefined` olur ve doğrudan
 * çağrı `TypeError: crypto.randomUUID is not a function` ile patlar. Bu yardımcı:
 *   1) `crypto.randomUUID` varsa onu kullanır,
 *   2) yoksa (secure context gerektirmeyen) `crypto.getRandomValues` ile RFC 4122
 *      v4 UUID üretir,
 *   3) o da yoksa `Math.random` fallback'ine düşer.
 *
 * Üretilen değer her durumda geçerli bir UUID string'idir → backend `Guid`
 * olarak parse edebilir. TableField `newRow` factory'leri (line item id'leri) ve
 * yeni kayıt id'leri için bu kullanılmalı; doğrudan `crypto.randomUUID()` değil.
 */
export function newId(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === "function") {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  // RFC 4122: sürüm (4) ve variant (10xx) bitlerini yerleştir.
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return (
    hex.slice(0, 4).join("") +
    "-" +
    hex.slice(4, 6).join("") +
    "-" +
    hex.slice(6, 8).join("") +
    "-" +
    hex.slice(8, 10).join("") +
    "-" +
    hex.slice(10, 16).join("")
  );
}
