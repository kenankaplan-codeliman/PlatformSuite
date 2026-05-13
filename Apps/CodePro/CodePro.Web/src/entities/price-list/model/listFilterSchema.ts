import { z } from 'zod';
import type { PriceListListFilter } from './types';

export const priceListListFilterSchema: z.ZodType<PriceListListFilter> = z.object({
  search: z.string().optional(),
  supplierAccountId: z.string().uuid().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<PriceListListFilter>;

export const priceListListFilterDefaults: PriceListListFilter = {};
