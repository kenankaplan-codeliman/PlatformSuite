/**
 * Byte değerini insanca okunur formata çevirir (1024 → "1 KB").
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const factor = 1024;
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(factor)), units.length - 1);
  const value = bytes / Math.pow(factor, i);
  return `${value.toFixed(decimals)} ${units[i]}`;
}
