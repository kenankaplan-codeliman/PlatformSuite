import { z } from 'zod';
import type { BrandListFilter } from './types';

export const brandListFilterSchema: z.ZodType<BrandListFilter> = z.object({
  search: z.string().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<BrandListFilter>;

export const brandListFilterDefaults: BrandListFilter = {};
