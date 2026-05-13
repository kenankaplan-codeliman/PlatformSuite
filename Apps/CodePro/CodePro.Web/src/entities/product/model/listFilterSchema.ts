import { z } from 'zod';
import type { ProductListFilter } from './types';

export const productListFilterSchema: z.ZodType<ProductListFilter> = z.object({
  search: z.string().optional(),
  productCategoryId: z.string().uuid().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<ProductListFilter>;

export const productListFilterDefaults: ProductListFilter = {};
