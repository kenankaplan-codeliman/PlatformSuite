import { z } from 'zod';
import { entityReferenceSchema } from '../../../shared/types/EntityReference';

export const organizationTypeEnum = [
  'EXECUTIVE',
  'INTERNAL_SYSTEM',
  'DEPARTMENT',
  'ADVISORY',
  'REGION',
  'BRANCH',
] as const;

export const appOrganizationSchema = z.object({
  id: z.string(),
  organizationCode: z.string().min(1, 'common:errors.required').max(50),
  organizationName: z.string().min(1, 'common:errors.required').max(150),
  description: z.string().max(1000),
  type: z.enum(organizationTypeEnum),
  costCenter: z.string().max(100).nullish(),
  parentOrganization: entityReferenceSchema.nullish(),
  reportsTo: entityReferenceSchema.nullish(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});
