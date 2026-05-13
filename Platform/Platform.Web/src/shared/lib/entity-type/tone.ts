import type { EntityTone } from './types';

/**
 * Semantik ton → AntD Tag preset color.
 * AntD Tag `color` prop'u preset isimleri kabul eder; renk paleti tek
 * noktada (burada) yönetilir, böylece tüm UI'da tutarlı kalır.
 */
export function toneToTagColor(tone: EntityTone | undefined): string {
  return tone ?? 'default';
}
