import { z } from 'zod';
import type { EDocumentListFilter } from './types';

export const EDOCUMENT_STATUSES = [
  'Draft',
  'Sent',
  'PartiallyApproved',
  'Approved',
  'Rejected',
  'Cancelled',
] as const;

export const eDocumentListFilterSchema: z.ZodType<EDocumentListFilter> = z.object({
  search: z.string().optional(),
  documentType: z.string().optional(),
  status: z.enum(EDOCUMENT_STATUSES).optional(),
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<EDocumentListFilter>;

export const eDocumentListFilterDefaults: EDocumentListFilter = {};
