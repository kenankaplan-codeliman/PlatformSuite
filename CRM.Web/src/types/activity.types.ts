// Activity Types - Based on ActivityBase.cs and derived entities

// ==================== ENUMS ====================

export const ActivityType = {
  Email: 1,
  PhoneCall: 2,
  Task: 3,
  Appointment: 4,
} as const;

export type ActivityTypeValue = (typeof ActivityType)[keyof typeof ActivityType];

export const ActivityStatus = {
  NotStarted: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3,
  Scheduled: 4,
  WaitingOnSomeone: 5,
  Deferred: 6,
} as const;

export type ActivityStatusValue = (typeof ActivityStatus)[keyof typeof ActivityStatus];

export const ActivityPriority = {
  Low: 0,
  Normal: 1,
  High: 2,
} as const;

export type ActivityPriorityValue = (typeof ActivityPriority)[keyof typeof ActivityPriority];

export const ActivityPartyType = {
  From: 1,
  To: 2,
  Cc: 3,
  Bcc: 4,
  Caller: 5,
  Recipient: 6,
  Organizer: 7,
  Attendee: 8,
  Required: 9,
  Optional: 10,
  Owner: 11,
} as const;

export type ActivityPartyTypeValue = (typeof ActivityPartyType)[keyof typeof ActivityPartyType];

export const ActivityParticipantType = {
  User: 1,
  Account: 2,
  Contact: 3,
  Lead: 4,
  External: 5,
} as const;

export type ActivityParticipantTypeValue = (typeof ActivityParticipantType)[keyof typeof ActivityParticipantType];

export const CallDirection = {
  Incoming: 0,
  Outgoing: 1,
} as const;

export type CallDirectionValue = (typeof CallDirection)[keyof typeof CallDirection];

// ==================== INTERFACES ====================

export interface ActivityParty {
  id: string;
  activityId: string;
  partyType: ActivityPartyTypeValue;
  participantType: ActivityParticipantTypeValue;
  participantId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  sortOrder: number;
  responseStatus?: string;
  respondedAt?: string;
  isActive: boolean;
}

export interface ActivityBase {
  id: string;
  activityId: string;
  subject: string;
  activityType: ActivityTypeValue;
  status: ActivityStatusValue;
  priority: ActivityPriorityValue;
  dueDate?: string;
  completedDate?: string;
  duration?: number;
  regardingEntityType?: string;
  regardingEntityId?: string;
  ownerId: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: string;
  parties?: ActivityParty[];
}

export interface EmailActivity extends ActivityBase {
  activityType: typeof ActivityType.Email;
  emailSubject?: string;
  body?: string;
  isHtml: boolean;
  sentDate?: string;
  isSent: boolean;
  isRead: boolean;
  readDate?: string;
}

export interface PhoneCallActivity extends ActivityBase {
  activityType: typeof ActivityType.PhoneCall;
  callDirection: CallDirectionValue;
  phoneNumber?: string;
  startedAt?: string;
  endedAt?: string;
  recordingUrl?: string;
  callNotes?: string;
  callResult?: string;
}

export interface TaskActivity extends ActivityBase {
  activityType: typeof ActivityType.Task;
  taskDescription?: string;
  isCompleted: boolean;
  taskCompletedAt?: string;
  reminderAt?: string;
  isReminderSet: boolean;
  isReminderSent: boolean;
  percentComplete: number;
  startDate?: string;
}

export interface AppointmentActivity extends ActivityBase {
  activityType: typeof ActivityType.Appointment;
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  reminderMinutesBefore?: number;
  recurrenceRule?: string;
  isRecurring: boolean;
  recurringParentId?: string;
  meetingNotes?: string;
}

export type Activity = EmailActivity | PhoneCallActivity | TaskActivity | AppointmentActivity;

export interface ActivityListFilters {
  subject?: string;
  activityType?: ActivityTypeValue;
  status?: ActivityStatusValue;
  priority?: ActivityPriorityValue;
  regardingEntityType?: string;
  regardingEntityId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  ownerId?: string;
  isActive?: boolean;
}

// ============================================
// RESPONSE TYPES - Service'den dönen yapılar
// ============================================

export interface ActivityListRequest {
  page: number;
  pageSize: number;
  filters?: ActivityListFilters;
}

export interface ActivityGetRequest {
  id: string;
}

export interface ActivityUpdateRequest {
  id: string;
  data: Partial<ActivityBase>;
}

export interface ActivityDeleteRequest {
  id: string;
}

export interface ActivityBulkDeleteRequest {
  ids: string[];
}

export interface ActivityBulkUpdateStatusRequest {
  ids: string[];
  status: ActivityStatusValue;
}



export interface ActivityListResponse {
  data: ActivityBase[];
  total?: number;
  hasMore?: boolean;
  page: number;
  pageSize: number;
}

// ==================== LABEL MAPS ====================

const ActivityTypeLabels: Record<ActivityTypeValue, string> = {
  [ActivityType.Email]: 'E-posta',
  [ActivityType.PhoneCall]: 'Telefon',
  [ActivityType.Task]: 'Görev',
  [ActivityType.Appointment]: 'Randevu',
};

const ActivityStatusLabels: Record<ActivityStatusValue, string> = {
  [ActivityStatus.NotStarted]: 'Başlamadı',
  [ActivityStatus.InProgress]: 'Devam Ediyor',
  [ActivityStatus.Completed]: 'Tamamlandı',
  [ActivityStatus.Cancelled]: 'İptal Edildi',
  [ActivityStatus.Scheduled]: 'Planlandı',
  [ActivityStatus.WaitingOnSomeone]: 'Beklemede',
  [ActivityStatus.Deferred]: 'Ertelendi',
};

const ActivityPriorityLabels: Record<ActivityPriorityValue, string> = {
  [ActivityPriority.Low]: 'Düşük',
  [ActivityPriority.Normal]: 'Normal',
  [ActivityPriority.High]: 'Yüksek',
};

const ActivityPartyTypeLabels: Record<ActivityPartyTypeValue, string> = {
  [ActivityPartyType.From]: 'Gönderen',
  [ActivityPartyType.To]: 'Alıcı',
  [ActivityPartyType.Cc]: 'CC',
  [ActivityPartyType.Bcc]: 'BCC',
  [ActivityPartyType.Caller]: 'Arayan',
  [ActivityPartyType.Recipient]: 'Aranan',
  [ActivityPartyType.Organizer]: 'Organizatör',
  [ActivityPartyType.Attendee]: 'Katılımcı',
  [ActivityPartyType.Required]: 'Zorunlu Katılımcı',
  [ActivityPartyType.Optional]: 'Opsiyonel Katılımcı',
  [ActivityPartyType.Owner]: 'Sahip',
};

const ActivityParticipantTypeLabels: Record<ActivityParticipantTypeValue, string> = {
  [ActivityParticipantType.User]: 'Kullanıcı',
  [ActivityParticipantType.Account]: 'Firma',
  [ActivityParticipantType.Contact]: 'Kişi',
  [ActivityParticipantType.Lead]: 'Aday Müşteri',
  [ActivityParticipantType.External]: 'Harici',
};

const CallDirectionLabels: Record<CallDirectionValue, string> = {
  [CallDirection.Incoming]: 'Gelen',
  [CallDirection.Outgoing]: 'Giden',
};

// ==================== COLOR MAPS ====================

const ActivityTypeColors: Record<ActivityTypeValue, string> = {
  [ActivityType.Email]: '#1890ff',
  [ActivityType.PhoneCall]: '#52c41a',
  [ActivityType.Task]: '#faad14',
  [ActivityType.Appointment]: '#722ed1',
};

const ActivityStatusColors: Record<ActivityStatusValue, string> = {
  [ActivityStatus.NotStarted]: 'default',
  [ActivityStatus.InProgress]: 'processing',
  [ActivityStatus.Completed]: 'success',
  [ActivityStatus.Cancelled]: 'error',
  [ActivityStatus.Scheduled]: 'purple',
  [ActivityStatus.WaitingOnSomeone]: 'warning',
  [ActivityStatus.Deferred]: 'orange',
};

const ActivityPriorityColors: Record<ActivityPriorityValue, string> = {
  [ActivityPriority.Low]: 'cyan',
  [ActivityPriority.Normal]: 'blue',
  [ActivityPriority.High]: 'red',
};

const CallDirectionColors: Record<CallDirectionValue, string> = {
  [CallDirection.Incoming]: 'green',
  [CallDirection.Outgoing]: 'blue',
};

// ==================== HELPER FUNCTIONS ====================

export const getActivityTypeLabel = (type: ActivityTypeValue): string => {
  return ActivityTypeLabels[type] ?? 'Bilinmiyor';
};

export const getActivityStatusLabel = (status: ActivityStatusValue): string => {
  return ActivityStatusLabels[status] ?? 'Bilinmiyor';
};

export const getActivityPriorityLabel = (priority: ActivityPriorityValue): string => {
  return ActivityPriorityLabels[priority] ?? 'Bilinmiyor';
};

export const getActivityPartyTypeLabel = (partyType: ActivityPartyTypeValue): string => {
  return ActivityPartyTypeLabels[partyType] ?? 'Bilinmiyor';
};

export const getActivityParticipantTypeLabel = (participantType: ActivityParticipantTypeValue): string => {
  return ActivityParticipantTypeLabels[participantType] ?? 'Bilinmiyor';
};

export const getCallDirectionLabel = (direction: CallDirectionValue): string => {
  return CallDirectionLabels[direction] ?? 'Bilinmiyor';
};

export const getActivityTypeColor = (type: ActivityTypeValue): string => {
  return ActivityTypeColors[type] ?? '#d9d9d9';
};

export const getActivityStatusColor = (status: ActivityStatusValue): string => {
  return ActivityStatusColors[status] ?? 'default';
};

export const getActivityPriorityColor = (priority: ActivityPriorityValue): string => {
  return ActivityPriorityColors[priority] ?? 'default';
};

export const getCallDirectionColor = (direction: CallDirectionValue): string => {
  return CallDirectionColors[direction] ?? 'default';
};

// ==================== SELECT OPTIONS ====================

export const activityTypeOptions = Object.entries(ActivityType).map(([, value]) => ({
  label: ActivityTypeLabels[value as ActivityTypeValue],
  value: value,
}));

export const activityStatusOptions = Object.entries(ActivityStatus).map(([, value]) => ({
  label: ActivityStatusLabels[value as ActivityStatusValue],
  value: value,
}));

export const activityPriorityOptions = Object.entries(ActivityPriority).map(([, value]) => ({
  label: ActivityPriorityLabels[value as ActivityPriorityValue],
  value: value,
}));

export const activityPartyTypeOptions = Object.entries(ActivityPartyType).map(([, value]) => ({
  label: ActivityPartyTypeLabels[value as ActivityPartyTypeValue],
  value: value,
}));

export const activityParticipantTypeOptions = Object.entries(ActivityParticipantType).map(([, value]) => ({
  label: ActivityParticipantTypeLabels[value as ActivityParticipantTypeValue],
  value: value,
}));

export const callDirectionOptions = Object.entries(CallDirection).map(([, value]) => ({
  label: CallDirectionLabels[value as CallDirectionValue],
  value: value,
}));

// ==================== TABLE FILTER OPTIONS ====================

export const activityTypeFilters = Object.entries(ActivityType).map(([, value]) => ({
  text: ActivityTypeLabels[value as ActivityTypeValue],
  value: value,
}));

export const activityStatusFilters = Object.entries(ActivityStatus).map(([, value]) => ({
  text: ActivityStatusLabels[value as ActivityStatusValue],
  value: value,
}));

export const activityPriorityFilters = Object.entries(ActivityPriority).map(([, value]) => ({
  text: ActivityPriorityLabels[value as ActivityPriorityValue],
  value: value,
}));

export const callDirectionFilters = Object.entries(CallDirection).map(([, value]) => ({
  text: CallDirectionLabels[value as CallDirectionValue],
  value: value,
}));