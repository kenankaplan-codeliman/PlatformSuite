import { z } from 'zod';
import type { LeadListFilter } from './types';

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'] as const;

export const LEAD_SOURCES = [
  'Other',
  'Website',
  'Email',
  'Phone',
  'Referral',
  'Advertisement',
  'SocialMedia',
  'Event',
  'PartnerNetwork',
] as const;

export const leadListFilterSchema: z.ZodType<LeadListFilter> = z.object({
  search: z.string().optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<LeadListFilter>;

export const leadListFilterDefaults: LeadListFilter = {};
