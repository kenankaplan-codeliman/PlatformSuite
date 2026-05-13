import { z } from 'zod';
import type { ProductCatalogListFilter } from './types';

export const productCatalogListFilterSchema: z.ZodType<ProductCatalogListFilter> = z.object({
  search: z.string().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<ProductCatalogListFilter>;

export const productCatalogListFilterDefaults: ProductCatalogListFilter = {};
