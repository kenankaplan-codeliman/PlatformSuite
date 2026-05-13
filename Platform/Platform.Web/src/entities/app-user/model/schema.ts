import { z } from 'zod';
import { entityReferenceSchema } from '../../../shared/types/EntityReference';

export const appUserSchema = z.object({
  id: z.string(),
  email: z.string().email('common:errors.email').max(150),
  firstName: z.string().min(1, 'common:errors.required').max(100),
  lastName: z.string().min(1, 'common:errors.required').max(100),
  phoneNumber: z.string().max(50).nullable().optional(),
  organization: entityReferenceSchema.nullable().refine((v) => v != null, {
    message: 'common:errors.required',
  }),
  manager: entityReferenceSchema.nullable(),
  roles: z.array(entityReferenceSchema).default([]),
  isActive: z.boolean(),
});
