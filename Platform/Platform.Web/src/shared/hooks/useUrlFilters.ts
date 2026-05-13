import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ZodType } from 'zod';

export interface UseUrlFiltersOptions<TFilter> {
  /** Filter shape'i + URL string'lerini bool/number'a koerce eden zod schema. */
  schema: ZodType<TFilter>;
  /** Hiç filtre yokken kullanılacak başlangıç değerleri (genelde `{}`). */
  defaultValues: TFilter;
  /**
   * URL query param prefix'i. Diğer paramlarla (örn. `view=calendar`) çakışmasın diye.
   * Default `f_`.
   */
  prefix?: string;
}

export interface UseUrlFiltersReturn<TFilter> {
  filters: TFilter;
  setFilters: (next: TFilter) => void;
  clearFilters: () => void;
}

/**
 * Liste sayfası filtre değerlerini URL query param'a senkronlar.
 *
 * - Okuma: `searchParams`'tan `prefix`'li key'leri çıkarır, schema ile parse eder.
 *   Parse hata verirse `defaultValues` döner (URL bozuk gelirse uygulama çökmez).
 * - Yazma: `setFilters(next)` mevcut paramlardan `prefix*` olanları temizler,
 *   `next`'in null/undefined/'' olmayan değerlerini stringle yazar. Diğer paramlar
 *   (sayfa-spesifik state, örn. `view=calendar`) korunur. `replace: true` —
 *   tarayıcı geçmişine yeni entry eklemez, sadece mevcut URL'i değiştirir.
 *
 * @example
 *   const { filters, setFilters, clearFilters } = useUrlFilters({
 *     schema: accountListFilterSchema,
 *     defaultValues: {},
 *   });
 */
export function useUrlFilters<TFilter extends object>(
  options: UseUrlFiltersOptions<TFilter>,
): UseUrlFiltersReturn<TFilter> {
  const { schema, defaultValues, prefix = 'f_' } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const searchString = searchParams.toString();

  const filters = useMemo<TFilter>(() => {
    const raw: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith(prefix) && value !== '') {
        raw[key.slice(prefix.length)] = value;
      }
    });

    if (Object.keys(raw).length === 0) {
      return defaultValues;
    }

    const parsed = schema.safeParse(raw);
    return parsed.success ? parsed.data : defaultValues;
    // searchString tüm key/value değişimini yakalar — schema ve defaults stabil referans.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

  const setFilters = useCallback(
    (next: TFilter) => {
      setSearchParams(
        (prev) => {
          const out = new URLSearchParams(prev);
          // Önce mevcut prefix'li tüm key'leri temizle.
          Array.from(out.keys())
            .filter((k) => k.startsWith(prefix))
            .forEach((k) => out.delete(k));
          // Sonra next'in dolu alanlarını yaz.
          Object.entries(next).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') return;
            out.set(`${prefix}${key}`, String(value));
          });
          return out;
        },
        { replace: true },
      );
    },
    [prefix, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const out = new URLSearchParams(prev);
        Array.from(out.keys())
          .filter((k) => k.startsWith(prefix))
          .forEach((k) => out.delete(k));
        return out;
      },
      { replace: true },
    );
  }, [prefix, setSearchParams]);

  return { filters, setFilters, clearFilters };
}
