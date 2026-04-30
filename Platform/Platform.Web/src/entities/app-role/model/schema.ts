import { z } from 'zod';

const accessLevelEnum = z.enum(['None', 'User', 'Organization', 'All']);

const privilegeSchema = z.object({
  privilegeCode: z.string().min(1),
  accessLevel: accessLevelEnum,
});

export const appRoleSchema = z.object({
  id: z.string(),
  roleName: z.string().min(1, 'common:errors.required').max(100),
  description: z.string().max(1000).nullable().optional(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  privileges: z.array(privilegeSchema),
});
