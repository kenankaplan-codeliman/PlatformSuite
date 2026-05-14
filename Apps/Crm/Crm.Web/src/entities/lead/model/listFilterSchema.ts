import { z } from 'zod';
import type { LeadListFilter } from './types';

// status / source GeneralParameter'a taşındı — statik const dizi yerine z.string().
export const leadListFilterSchema: z.ZodType<LeadListFilter> = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<LeadListFilter>;

export const leadListFilterDefaults: LeadListFilter = {};
