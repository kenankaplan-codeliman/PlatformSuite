import { z } from 'zod';
import type { ProductCategoryListFilter } from './types';

export const productCategoryListFilterSchema: z.ZodType<ProductCategoryListFilter> = z.object({
  search: z.string().optional(),
  parentCategoryId: z.string().uuid().nullable().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<ProductCategoryListFilter>;

export const productCategoryListFilterDefaults: ProductCategoryListFilter = {};
