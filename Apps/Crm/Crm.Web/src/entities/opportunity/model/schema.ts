import { z } from 'zod';
import { entityReferenceSchema } from '@platform/ui';

export const opportunityStageEnum = [
  'Prospecting',
  'Qualification',
  'NeedsAnalysis',
  'Proposal',
  'Negotiation',
  'ClosedWon',
  'ClosedLost',
] as const;

export const opportunitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'common:errors.required').max(250),
  description: z.string().nullish(),
  account: entityReferenceSchema.nullish(),
  primaryContact: entityReferenceSchema.nullish(),
  stage: z.enum(opportunityStageEnum),
  amount: z.number().min(0).nullish(),
  probability: z.number().int().min(0).max(100),
  closeDate: z.string().nullish(),
  lossReason: z.string().max(500).nullish(),
  isActive: z.boolean(),
});
