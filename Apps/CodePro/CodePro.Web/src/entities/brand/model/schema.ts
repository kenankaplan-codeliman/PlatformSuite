import { z } from 'zod';

export const brandSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'common:errors.required').max(100),
  isActive: z.boolean(),
});
