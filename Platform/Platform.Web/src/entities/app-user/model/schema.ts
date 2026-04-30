import { z } from 'zod';

export const appUserSchema = z.object({
  id: z.string(),
  email: z.string().email('common:errors.email').max(150),
  firstName: z.string().min(1, 'common:errors.required').max(100),
  lastName: z.string().min(1, 'common:errors.required').max(100),
  phoneNumber: z.string().max(50).nullable().optional(),
  organizationId: z.string().uuid(),
  managerId: z.string().uuid().nullable().optional(),
  isActive: z.boolean(),
});
