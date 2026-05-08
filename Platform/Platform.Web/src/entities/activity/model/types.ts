/**
 * Backend DTO'ları ile birebir uyumlu — `Platform.Application/Modals/ActivityModal/**`
 * + `Platform.Application/Features/Activities/**`.
 *
 * Activity polimorfik bir aggregate'tir: aynı endpoint ailesi (`api/activity/*`)
 * dört alt türü servis eder. Discriminator: `activityType`.
 */

import type { EntityReference } from '../../../shared/types/EntityReference';

export type ActivityType = 'PhoneCall' | 'Task' | 'Appointment' | 'Email';
export type ActivityStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'Cancelled';
export type ActivityPriority = 'Low' | 'Normal' | 'High';
export type CallDirection = 'Incoming' | 'Outgoing';

export const ACTIVITY_TYPES: ActivityType[] = ['PhoneCall', 'Task', 'Appointment', 'Email'];
export const ACTIVITY_STATUSES: ActivityStatus[] = ['NotStarted', 'InProgress', 'Completed', 'Cancelled'];
export const ACTIVITY_PRIORITIES: ActivityPriority[] = ['Low', 'Normal', 'High'];

/** URL'de kullanılan kebab-case → enum dönüşümü. */
export const ACTIVITY_TYPE_BY_SLUG: Record<string, ActivityType> = {
  phonecall: 'PhoneCall',
  task: 'Task',
  appointment: 'Appointment',
  email: 'Email',
};

export const ACTIVITY_SLUG_BY_TYPE: Record<ActivityType, string> = {
  PhoneCall: 'phonecall',
  Task: 'task',
  Appointment: 'appointment',
  Email: 'email',
};

interface ActivityBaseFields {
  id: string;
  subject: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  startDate?: string | null;
  endDate?: string | null;
  dueDate?: string | null;
  regardingEntity?: EntityReference | null;
  owner?: EntityReference | null;
  isActive: boolean;
}

export interface PhoneCallActivityDetail extends ActivityBaseFields {
  activityType: 'PhoneCall';
  caller?: EntityReference | null;
  recipient?: EntityReference | null;
  direction: CallDirection;
  callNotes?: string | null;
  recordingUrl?: string | null;
}

export interface TaskActivityDetail extends ActivityBaseFields {
  activityType: 'Task';
  taskDescription?: string | null;
  percentComplete: number;
  reminderAt?: string | null;
}

export interface AppointmentActivityDetail extends ActivityBaseFields {
  activityType: 'Appointment';
  organizer?: EntityReference | null;
  attendees: EntityReference[];
  location?: string | null;
  isOnline: boolean;
  meetingUrl?: string | null;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  reminderMinutesBefore?: number | null;
  reminderSet?: boolean | null;
  recurrenceRule?: string | null;
  isRecurring: boolean;
  recurringParentId?: string | null;
  meetingNotes?: string | null;
}

export interface EmailActivityDetail extends ActivityBaseFields {
  activityType: 'Email';
  from?: EntityReference | null;
  to: EntityReference[];
  cc?: EntityReference[] | null;
  bcc?: EntityReference[] | null;
  body: string;
  isHtml: boolean;
  isSent: boolean;
  isRead: boolean;
  readDate?: string | null;
}

export type ActivityDetailItem =
  | PhoneCallActivityDetail
  | TaskActivityDetail
  | AppointmentActivityDetail
  | EmailActivityDetail;

export interface ActivityListItem {
  id: string;
  subject: string;
  activityType: ActivityType;
  status: ActivityStatus;
  priority: ActivityPriority;
  startDate?: string | null;
  endDate?: string | null;
  dueDate?: string | null;
  owner?: EntityReference | null;
  isActive: boolean;
}

export interface ActivityListFilter {
  subject?: string;
  activityType?: ActivityType;
  status?: ActivityStatus;
  priority?: ActivityPriority;
  regardingEntityType?: string;
  regardingEntityId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  ownerId?: string;
  isActive?: boolean;
}

export type PhoneCallFormValues = Omit<PhoneCallActivityDetail, never>;
export type TaskFormValues = Omit<TaskActivityDetail, never>;
export type AppointmentFormValues = Omit<AppointmentActivityDetail, never>;
export type EmailFormValues = Omit<EmailActivityDetail, never>;

export type ActivityFormValues =
  | PhoneCallFormValues
  | TaskFormValues
  | AppointmentFormValues
  | EmailFormValues;
