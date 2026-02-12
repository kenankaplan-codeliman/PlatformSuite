import type { EntityReference, EntityTypeValue } from '@/types/entity.lookup.types';
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

export const getActivityStatusLabel = (status: ActivityStatusValue): string => {
  const labels: Record<ActivityStatusValue, string> = {
    [ActivityStatus.NotStarted]: 'Başlamadı',
    [ActivityStatus.InProgress]: 'Devam Ediyor',
    [ActivityStatus.Completed]: 'Tamamlandı',
    [ActivityStatus.Cancelled]: 'İptal Edildi',
    //[ActivityStatus.Deferred]: 'Ertelendi',
  };
  return labels[status] || 'Bilinmiyor';
};

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
    [ActivityType.Email]: 'E-posta',
    [ActivityType.PhoneCall]: 'Telefon',
    [ActivityType.Task]: 'Görev',
    [ActivityType.Appointment]: 'Randevu',
  };
  return labels[type] || 'Bilinmiyor';
};

export const getActivityTypeColor = (type: ActivityTypeValue): string => {
  const colors: Record<ActivityTypeValue, string> = {
    [ActivityType.Email]: '#1890ff',
    [ActivityType.PhoneCall]: '#52c41a',
    [ActivityType.Task]: '#faad14',
    [ActivityType.Appointment]: '#722ed1',
  };
  return colors[type] || '#8c8c8c';
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

export const getActivityPriorityLabel = (priority: ActivityPriorityValue): string => {
  const labels: Record<ActivityPriorityValue, string> = {
    [ActivityPriority.Low]: 'Düşük',
    [ActivityPriority.Normal]: 'Normal',
    [ActivityPriority.High]: 'Yüksek',
  };
  return labels[priority] || 'Bilinmiyor';
};

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

export interface ActivityBulkDeleteRequest {
  ids: string[];
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

export const activityStatusOptions = [
  { label: 'Başlamadı', value: ActivityStatus.NotStarted },
  { label: 'Devam Ediyor', value: ActivityStatus.InProgress },
  { label: 'Tamamlandı', value: ActivityStatus.Completed },
  { label: 'İptal Edildi', value: ActivityStatus.Cancelled },
  //{ label: 'Ertelendi', value: ActivityStatus.Deferred },
];

export const activityTypeOptions = [
  { label: 'E-posta', value: ActivityType.Email },
  { label: 'Telefon', value: ActivityType.PhoneCall },
  { label: 'Görev', value: ActivityType.Task },
  { label: 'Randevu', value: ActivityType.Appointment },
];

export const activityPriorityOptions = [
  { label: 'Düşük', value: ActivityPriority.Low },
  { label: 'Normal', value: ActivityPriority.Normal },
  { label: 'Yüksek', value: ActivityPriority.High },
];

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
