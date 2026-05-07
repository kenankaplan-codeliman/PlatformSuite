import { z } from 'zod';
import { entityReferenceSchema } from '@platform/ui';

export const priceListSchema = z.object({
  id: z.string(),
  code: z.string().max(50),
  name: z.string().min(1, 'common:errors.required').max(200),
  description: z.string().max(1000).nullable().optional(),
  supplierAccount: entityReferenceSchema.nullish(),
  isActive: z.boolean(),
});
