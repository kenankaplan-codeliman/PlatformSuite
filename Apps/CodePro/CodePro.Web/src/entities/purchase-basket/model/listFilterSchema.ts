import { z } from 'zod';
import type { PurchaseBasketListFilter } from './types';

export const PURCHASE_BASKET_STATUSES = ['Preparing', 'Submitted', 'Cancelled'] as const;

export const purchaseBasketListFilterSchema: z.ZodType<PurchaseBasketListFilter> = z.object({
  status: z.enum(PURCHASE_BASKET_STATUSES).optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<PurchaseBasketListFilter>;

export const purchaseBasketListFilterDefaults: PurchaseBasketListFilter = {};
