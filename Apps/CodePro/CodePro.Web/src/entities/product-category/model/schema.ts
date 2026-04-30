import { z } from 'zod';

export const productCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'common:errors.required').max(150),
  code: z.string().max(50).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  parentCategoryId: z.string().uuid().nullable().optional(),
  isActive: z.boolean(),
});
