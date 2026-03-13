
export const toLocalISO = (date: Date | string | null | undefined): string | undefined => {
  if (!date) return undefined;

  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) return undefined; // invalid date guard
  
  const off = d.getTimezoneOffset();

  return new Date(d.getTime() - off * 60000).toISOString().slice(0, -1);
};

/**
 * Tarihi yerel formatta gösterir.
 * @param date - Tarih değeri
 * @param withTime - true ise saat ve dakika da gösterilir (varsayılan: true)
 * @returns "DD.MM.YYYY HH:mm" veya "DD.MM.YYYY" formatında string, geçersiz/boş ise undefined
 */
export const formatDate = (
  date: Date | string | null | undefined,
  withTime = true
): string | undefined => {
  if (!date) return undefined;
 
  const d = date instanceof Date ? date : new Date(date);
 
  if (isNaN(d.getTime())) return undefined;
 
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
 
  if (!withTime) return `${dd}.${mm}.${yyyy}`;
 
  const hh  = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
 
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
};