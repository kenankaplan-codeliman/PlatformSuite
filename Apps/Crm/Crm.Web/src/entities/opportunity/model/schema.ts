import { z } from 'zod';
import { entityReferenceSchema } from '@platform/ui';

// stage GeneralParameter'a taşındı — statik z.enum yerine z.string().
// Geçerli code doğrulaması backend handler'ında (IGeneralParameterReader) yapılır.
export const opportunitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'common:errors.required').max(250),
  description: z.string().nullish(),
  account: entityReferenceSchema.nullish(),
  primaryContact: entityReferenceSchema.nullish(),
  stage: z.string().min(1, 'common:errors.required'),
  amount: z.number().min(0).nullish(),
  probability: z.number().int().min(0).max(100),
  closeDate: z.string().nullish(),
  lossReason: z.string().max(500).nullish(),
  isActive: z.boolean(),
});
