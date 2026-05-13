import { z } from 'zod';
import type { PurchaseOrderListFilter } from './types';

export const PURCHASE_ORDER_STATUSES = [
  'Draft',
  'Sent',
  'Acknowledged',
  'PartialDelivered',
  'Delivered',
  'Cancelled',
  'Closed',
] as const;

export const PURCHASE_ORDER_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const;

export const purchaseOrderListFilterSchema: z.ZodType<PurchaseOrderListFilter> = z.object({
  search: z.string().optional(),
  status: z.enum(PURCHASE_ORDER_STATUSES).optional(),
  priority: z.enum(PURCHASE_ORDER_PRIORITIES).optional(),
  supplierAccountId: z.string().uuid().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<PurchaseOrderListFilter>;

export const purchaseOrderListFilterDefaults: PurchaseOrderListFilter = {};
