/** Dashboard widget'larının paylaştığı küçük biçimlendirme yardımcıları (tr-TR). */
const LOCALE = 'tr-TR';
const EMPTY = '—';

export function formatNumber(value?: number | null): string {
  if (value == null) return EMPTY;
  return new Intl.NumberFormat(LOCALE).format(value);
}

export function formatMoney(value?: number | null, currency?: string | null): string {
  if (value == null) return EMPTY;
  const n = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(value);
  return currency ? `${n} ${currency}` : n;
}

export function formatPercent(value?: number | null): string {
  if (value == null) return EMPTY;
  return `%${new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 }).format(value)}`;
}

export function formatDate(value?: string | null): string {
  if (!value) return EMPTY;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return EMPTY;
  return new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}
