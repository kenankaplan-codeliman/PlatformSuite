import { EntityType, type EntityReference, type EntityTypeValue } from '@/types/entity.lookup.types';
import { getEntityColor, getEntityIcon, getEntityLabel } from '@/config/entity.config';
import i18n from '@/config/i18n.config';

/**
 * Activity Types
 * Lead modülü ile tutarlı request/response yapısı
 */
// ============================================
// ACTIVITY PARTY (Katılımcı bilgisi)
// ============================================

export const PartyType = {
  Organizer: 'organizer',
  Attendee: 'attendee',
  Regarding: 'regarding',
  Owner: 'owner',
  From: 'from',
  To: 'to',
  CC: 'cc',
  BCC: 'bcc',
} as const;

export type PartyTypeValue = (typeof PartyType)[keyof typeof PartyType];

export interface ActivityParty {
  id: string;
  partyType: PartyTypeValue;
  entityType: string;
  entityId: string;
  entityName: string;
  email?: string;
  phone?: string;
  isRequired?: boolean;
  response?: number; // Appointment için: Accepted, Declined, Tentative
}

// ============================================
// ACTIVITY STATUS
// ============================================

export const ActivityStatus = {
  NotStarted: 'notStarted',
  InProgress: 'inProgress',
  Completed: 'completed',
  Cancelled: 'cancelled',
  //Deferred: 'deferred',
} as const;

export type ActivityStatusValue = (typeof ActivityStatus)[keyof typeof ActivityStatus];

export const getActivityStatusLabel = (status: ActivityStatusValue): string =>
  i18n.t(`enums:activityStatus.${status}`, { defaultValue: status });

export const getActivityStatusColor = (status: ActivityStatusValue): string => {
  const colors: Record<ActivityStatusValue, string> = {
    [ActivityStatus.NotStarted]: 'default',
    [ActivityStatus.InProgress]: 'processing',
    [ActivityStatus.Completed]: 'success',
    [ActivityStatus.Cancelled]: 'error',
    //[ActivityStatus.Deferred]: 'warning',
  };
  return colors[status] || 'default';
};

// ============================================
// ACTIVITY TYPE
// ============================================

export const ActivityType = {
  Email: 'email',
  PhoneCall: 'phoneCall',
  Task: 'task',
  Appointment: 'appointment',
} as const;

export type ActivityTypeValue = (typeof ActivityType)[keyof typeof ActivityType];

export const getActivityTypeLabel = (type: ActivityTypeValue): string => {
  const labels: Record<ActivityTypeValue, string> = {
    [ActivityType.Email]: getEntityLabel(EntityType.Email),
    [ActivityType.PhoneCall]: getEntityLabel(EntityType.PhoneCall),
    [ActivityType.Task]: getEntityLabel(EntityType.Task),
    [ActivityType.Appointment]: getEntityLabel(EntityType.Appointment),
  };
  return labels[type] || 'Bilinmiyor';
};

export const getActivityTypeColor = (type: ActivityTypeValue): string => {
  const colors: Record<ActivityTypeValue, string> = {
    [ActivityType.Email]: getEntityColor(EntityType.Email),
    [ActivityType.PhoneCall]: getEntityColor(EntityType.PhoneCall),
    [ActivityType.Task]: getEntityColor(EntityType.Task),
    [ActivityType.Appointment]: getEntityColor(EntityType.Appointment),
  };
  return colors[type] || '#8c8c8c';
};

export const getActivityTypeIcon = (type: ActivityTypeValue): React.ReactNode => {
  const icons: Record<ActivityTypeValue, React.ReactNode> = {
    [ActivityType.Email]: getEntityIcon(EntityType.Email),
    [ActivityType.PhoneCall]: getEntityIcon(EntityType.PhoneCall),
    [ActivityType.Task]: getEntityIcon(EntityType.Task),
    [ActivityType.Appointment]: getEntityIcon(EntityType.Appointment),
  };
  return icons[type];
};


// ============================================
// ACTIVITY PRIORITY
// ============================================

export const ActivityPriority = {
  Low: 'low',
  Normal: 'normal',
  High: 'high',
} as const;

export type ActivityPriorityValue = (typeof ActivityPriority)[keyof typeof ActivityPriority];

export const getActivityPriorityLabel = (priority: ActivityPriorityValue): string =>
  i18n.t(`enums:activityPriority.${priority}`, { defaultValue: priority });

export const getActivityPriorityColor = (priority: ActivityPriorityValue): string => {
  const colors: Record<ActivityPriorityValue, string> = {
    [ActivityPriority.Low]: 'default',
    [ActivityPriority.Normal]: 'blue',
    [ActivityPriority.High]: 'red',
  };
  return colors[priority] || 'default';
};

// ============================================
// BASE ACTIVITY INTERFACE
// ============================================

export interface ActivityBase {
  id: string;

  subject: string;
  
  activityType: ActivityTypeValue;
  status: ActivityStatusValue;
  priority: ActivityPriorityValue;

  startDate: string;
  dueDate: string;
  endDate?: string;
  
  
  
  // İlgili kayıt - EntityReference olarak
  regardingEntity?: EntityReference | null;
  
  // Sahip ve organizasyon
  owner?: EntityReference | null;
  
  isActive: boolean;
  
}

// ============================================
// LIST ACTIVITY INTERFACE
// ============================================

export interface ActivityListItem {
  id: string;

  subject: string;
  
  activityType: ActivityTypeValue;
  status: ActivityStatusValue;
  priority: ActivityPriorityValue;

  startDate?: string;
  endDate?: string;
  dueDate?: string;
  
  // Sahip ve organizasyon
  owner?: EntityReference | null;
  
  isActive: boolean;
}

// ============================================
// EMAIL ACTIVITY
// ============================================

export interface EmailActivity extends ActivityBase {
  activityType: typeof ActivityType.Email;
  
  // E-posta alanları - EntityReference olarak
  from: EntityReference | null;
  to: EntityReference[];
  cc?: EntityReference[];
  bcc?: EntityReference[];
  
  // E-posta içeriği
  body: string;

  isHtml?: boolean;
  isSent?: boolean;
  isRead?: boolean;
  readDate?: string;
    
}

// ============================================
// PHONE CALL ACTIVITY
// ============================================
export const Direction = {
  Incoming: 'Incoming',
  Outgoing: 'Outgoing',
} as const;

export type DirectionValue = (typeof Direction)[keyof typeof Direction];



export interface PhoneCallActivity extends ActivityBase {
  activityType: typeof ActivityType.PhoneCall;
  
  // Görüşme tarafları - EntityReference olarak
  caller?: EntityReference | null;
  recipient?: EntityReference | null;
  
  // Telefon bilgileri
  direction: DirectionValue;
  
  // Notlar
  callNotes?: string;

  recordingUrl?: string;  // Arama kaydı URL'si ekranda olmayabilir.
}

// ============================================
// TASK ACTIVITY
// ============================================

export interface TaskActivity extends ActivityBase {
  activityType: typeof ActivityType.Task;
   
  taskDescription: string;
  
  // İlerleme
  percentComplete?: number;
  
  // Hatırlatma
  reminderAt?: string;
}

// ============================================
// APPOINTMENT ACTIVITY
// ============================================

export interface AppointmentActivity extends ActivityBase {
  activityType: typeof ActivityType.Appointment;
  
  // Organizatör - EntityReference olarak (tek seçim)
  organizer?: EntityReference | null;
  
  // Katılımcılar - EntityReference array olarak (çoklu seçim)
  attendees?: EntityReference[];
  
  // Konum bilgileri
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
  
  // Zaman bilgileri
  isAllDay: boolean;
  
  // Hatırlatma
  reminderMinutesBefore?: number;
  reminderSet?: boolean;
  
  // Tekrarlama
  recurrenceRule?: string;
  isRecurring: boolean;
  recurringParentId?: string;
  
  // Notlar
  meetingNotes?: string;

}

// ============================================
// FILTER INTERFACE
// ============================================

export interface ActivityListFilters {
  subject?: string;
  activityType?: ActivityTypeValue;
  status?: ActivityStatusValue;
  priority?: ActivityPriorityValue;
  regardingEntityType?: EntityTypeValue;
  regardingEntityId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  ownerId?: string;
  isActive?: boolean;
}

// ============================================
// REQUEST TYPES
// ============================================
export interface ActivityRequest {
  id: string;
}

export interface ActivityListRequest {
  page: number;
  pageSize: number;
  filters?: ActivityListFilters;
}

export interface ActivityCalendarRequest {
  startDate: string;
  endDate: string;
  filters?: ActivityListFilters;
}

export interface ActivityBulkUpdateStatusRequest {
  ids: string[];
  status: ActivityStatusValue;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface ActivityListResponse {
  data: ActivityListItem[];
  total?: number;
  hasMore?: boolean;
  page: number;
  pageSize: number;
}

// ============================================
// SELECT OPTIONS
// ============================================

export const activityStatusOptions = Object.values(ActivityStatus).map((value) => ({
  label: getActivityStatusLabel(value),
  value,
}));

export const activityTypeOptions = [
  { label: 'E-posta', value: ActivityType.Email },
  { label: 'Telefon', value: ActivityType.PhoneCall },
  { label: 'Görev', value: ActivityType.Task },
  { label: 'Randevu', value: ActivityType.Appointment },
];

export const activityPriorityOptions = Object.values(ActivityPriority).map((value) => ({
  label: getActivityPriorityLabel(value),
  value,
}));

// ============================================
// TABLE FILTER OPTIONS
// ============================================

export const activityStatusFilters = activityStatusOptions.map((opt) => ({
  text: opt.label,
  value: opt.value,
}));

export const activityTypeFilters = activityTypeOptions.map((opt) => ({
  text: opt.label,
  value: opt.value,
}));

export const activityPriorityFilters = activityPriorityOptions.map((opt) => ({
  text: opt.label,
  value: opt.value,
}));
