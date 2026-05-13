import { z } from 'zod';
import type { ContractListFilter } from './types';

export const CONTRACT_TYPES = ['Sales', 'Purchase', 'Service', 'Nda', 'Framework', 'Other'] as const;

export const CONTRACT_STATUSES = [
  'Draft',
  'PendingInternalApproval',
  'InternallyApproved',
  'Sent',
  'Signed',
  'Active',
  'Expired',
  'Cancelled',
  'Terminated',
] as const;

export const contractListFilterSchema: z.ZodType<ContractListFilter> = z.object({
  search: z.string().optional(),
  type: z.enum(CONTRACT_TYPES).optional(),
  status: z.enum(CONTRACT_STATUSES).optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<ContractListFilter>;

export const contractListFilterDefaults: ContractListFilter = {};
