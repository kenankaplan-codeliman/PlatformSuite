import { z } from 'zod';
import type { PurchaseRequestListFilter } from './types';

export const PURCHASE_REQUEST_STATUSES = [
  'Setup',
  'PendingApproval',
  'InPurchasing',
  'PartialOrderCreated',
  'OrderCreated',
  'Rejected',
  'Completed',
  'Cancelled',
] as const;

export const PURCHASE_REQUEST_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const;

export const purchaseRequestListFilterSchema: z.ZodType<PurchaseRequestListFilter> = z.object({
  search: z.string().optional(),
  status: z.enum(PURCHASE_REQUEST_STATUSES).optional(),
  priority: z.enum(PURCHASE_REQUEST_PRIORITIES).optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<PurchaseRequestListFilter>;

export const purchaseRequestListFilterDefaults: PurchaseRequestListFilter = {};
