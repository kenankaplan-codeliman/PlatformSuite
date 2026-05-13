import { z } from 'zod';
import type { OpportunityListFilter } from './types';

export const OPPORTUNITY_STAGES = [
  'Prospecting',
  'Qualification',
  'NeedsAnalysis',
  'Proposal',
  'Negotiation',
  'ClosedWon',
  'ClosedLost',
] as const;

export const opportunityListFilterSchema: z.ZodType<OpportunityListFilter> = z.object({
  search: z.string().optional(),
  stage: z.enum(OPPORTUNITY_STAGES).optional(),
  accountId: z.string().uuid().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<OpportunityListFilter>;

export const opportunityListFilterDefaults: OpportunityListFilter = {};
