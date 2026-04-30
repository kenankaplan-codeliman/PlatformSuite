import { z } from 'zod';

export const budgetCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'common:errors.required').max(200),
  code: z.string().max(50).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  parentCategoryId: z.string().uuid().nullable().optional(),
  isActive: z.boolean(),
});
