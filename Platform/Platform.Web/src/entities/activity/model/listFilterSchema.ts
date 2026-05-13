import { z } from 'zod';
import type { ActivityListFilter } from './types';

export const ACTIVITY_TYPES_LIST = ['PhoneCall', 'Task', 'Appointment', 'Email'] as const;

export const ACTIVITY_STATUSES_LIST = [
  'NotStarted',
  'InProgress',
  'Completed',
  'Cancelled',
] as const;

export const ACTIVITY_PRIORITIES_LIST = ['Low', 'Normal', 'High'] as const;

export const activityListFilterSchema: z.ZodType<ActivityListFilter> = z.object({
  subject: z.string().optional(),
  activityType: z.enum(ACTIVITY_TYPES_LIST).optional(),
  status: z.enum(ACTIVITY_STATUSES_LIST).optional(),
  priority: z.enum(ACTIVITY_PRIORITIES_LIST).optional(),
  regardingEntityType: z.string().optional(),
  regardingEntityId: z.string().uuid().optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
  ownerId: z.string().uuid().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<ActivityListFilter>;

export const activityListFilterDefaults: ActivityListFilter = {};
