import { z } from 'zod';
import type { OfferListFilter } from './types';

export const OFFER_TYPES = ['Sales', 'Purchase'] as const;

export const OFFER_STATUSES = [
  'Draft',
  'PendingInternalApproval',
  'InternallyApproved',
  'PendingExternalApproval',
  'Sent',
  'Won',
  'Lost',
  'Cancelled',
  'Expired',
] as const;

export const offerListFilterSchema: z.ZodType<OfferListFilter> = z.object({
  search: z.string().optional(),
  offerType: z.enum(OFFER_TYPES).optional(),
  status: z.enum(OFFER_STATUSES).optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<OfferListFilter>;

export const offerListFilterDefaults: OfferListFilter = {};
