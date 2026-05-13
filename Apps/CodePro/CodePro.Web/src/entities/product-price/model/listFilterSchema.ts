import { z } from 'zod';
import type { ProductPriceListFilter } from './types';

export const productPriceListFilterSchema: z.ZodType<ProductPriceListFilter> = z.object({
  productId: z.string().uuid().optional(),
  supplierAccountId: z.string().uuid().optional(),
  priceListId: z.string().uuid().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<ProductPriceListFilter>;

export const productPriceListFilterDefaults: ProductPriceListFilter = {};
