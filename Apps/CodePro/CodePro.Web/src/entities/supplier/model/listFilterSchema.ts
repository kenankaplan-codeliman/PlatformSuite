import { z } from 'zod';
import type { SupplierListFilter } from './types';

/**
 * URL query param'larından gelen string'leri `SupplierListFilter`'a koerce eder.
 * Boş/eksik alanlar `undefined` döner — backend handler null-safe.
 *
 * supplierType / supplierStatus / companyType GeneralParameter'a taşındı —
 * statik z.enum yerine düz string; geçerli code listesi runtime'da
 * `useGeneralParameters` ile çekilir.
 */
export const supplierListFilterSchema: z.ZodType<SupplierListFilter> = z.object({
  search: z.string().optional(),
  supplierType: z.string().optional(),
  supplierStatus: z.string().optional(),
  companyType: z.string().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<SupplierListFilter>;

export const supplierListFilterDefaults: SupplierListFilter = {};
