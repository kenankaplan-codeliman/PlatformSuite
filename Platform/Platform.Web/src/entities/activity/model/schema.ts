import { z } from 'zod';
import { entityReferenceSchema } from '../../../shared/types/EntityReference';

const statusEnum = z.enum(['NotStarted', 'InProgress', 'Completed', 'Cancelled']);
const priorityEnum = z.enum(['Low', 'Normal', 'High']);

const baseShape = {
  id: z.string(),
  subject: z.string().min(1, 'common:errors.required').max(500),
  status: statusEnum,
  priority: priorityEnum,
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  dueDate: z.string().nullish(),
  regardingEntity: entityReferenceSchema.nullish(),
  owner: entityReferenceSchema.nullish(),
  isActive: z.boolean(),
};

export const phoneCallSchema = z.object({
  ...baseShape,
  activityType: z.literal('PhoneCall'),
  caller: entityReferenceSchema.nullish(),
  recipient: entityReferenceSchema.nullish(),
  direction: z.enum(['Incoming', 'Outgoing']),
  callNotes: z.string().nullish(),
  isHtml: z.boolean(),
  recordingUrl: z.string().nullish(),
});

export const taskSchema = z.object({
  ...baseShape,
  activityType: z.literal('Task'),
  taskDescription: z.string().nullish(),
  isHtml: z.boolean(),
  percentComplete: z.number().min(0).max(100),
  reminderAt: z.string().nullish(),
});

export const appointmentSchema = z.object({
  ...baseShape,
  activityType: z.literal('Appointment'),
  organizer: entityReferenceSchema.nullish(),
  attendees: z.array(entityReferenceSchema),
  location: z.string().nullish(),
  isOnline: z.boolean(),
  meetingUrl: z.string().nullish(),
  startTime: z.string().min(1, 'common:errors.required'),
  endTime: z.string().min(1, 'common:errors.required'),
  isAllDay: z.boolean(),
  reminderMinutesBefore: z.number().nullish(),
  reminderSet: z.boolean().nullish(),
  recurrenceRule: z.string().nullish(),
  isRecurring: z.boolean(),
  recurringParentId: z.string().nullish(),
  meetingNotes: z.string().nullish(),
  isHtml: z.boolean(),
});

export const emailSchema = z.object({
  ...baseShape,
  activityType: z.literal('Email'),
  from: entityReferenceSchema.nullish(),
  to: z.array(entityReferenceSchema),
  cc: z.array(entityReferenceSchema).nullish(),
  bcc: z.array(entityReferenceSchema).nullish(),
  body: z.string(),
  isHtml: z.boolean(),
  isSent: z.boolean(),
  isRead: z.boolean(),
  readDate: z.string().nullish(),
});

export const activitySchemaByType = {
  PhoneCall: phoneCallSchema,
  Task: taskSchema,
  Appointment: appointmentSchema,
  Email: emailSchema,
} as const;
