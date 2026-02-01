import { ActivityType } from '@/types/activity.types';
import type { ActivityTypeValue } from '@/types/activity.types';

// ==================== BASE PATHS ====================

export const BasePaths = {
  DashboardPath: '/',
  Login: '/login',
  LeadPath: '/lead',
  ActivityPath: '/activity',
  AccountPath: '/account',
  ContactPath: '/contact',
  OpportunityPath: '/opportunity',
  ReportsPath: '/reports',
  SettingsPath: '/settings',
} as const;

// ==================== LEAD PATHS ====================

export const Lead = {
  List: BasePaths.LeadPath,
  New: `${BasePaths.LeadPath}/new`,
  Detail: (id: string) => `${BasePaths.LeadPath}/${id}`,
  Edit: (id: string) => `${BasePaths.LeadPath}/${id}?mode=edit`,
  View: (id: string) => `${BasePaths.LeadPath}/${id}?mode=view`,
} as const;

// ==================== ACTIVITY SUB-PATHS ====================

const ACTIVITY_BASE = BasePaths.ActivityPath;

// Email paths
const Email = {
  New: `${ACTIVITY_BASE}/email/new`,
  Detail: (id: string) => `${ACTIVITY_BASE}/email/${id}`,
  Edit: (id: string) => `${ACTIVITY_BASE}/email/${id}?mode=edit`,
  View: (id: string) => `${ACTIVITY_BASE}/email/${id}?mode=view`,
} as const;

// Phone Call paths
const PhoneCall = {
  New: `${ACTIVITY_BASE}/phonecall/new`,
  Detail: (id: string) => `${ACTIVITY_BASE}/phonecall/${id}`,
  Edit: (id: string) => `${ACTIVITY_BASE}/phonecall/${id}?mode=edit`,
  View: (id: string) => `${ACTIVITY_BASE}/phonecall/${id}?mode=view`,
} as const;

// Task paths
const Task = {
  New: `${ACTIVITY_BASE}/task/new`,
  Detail: (id: string) => `${ACTIVITY_BASE}/task/${id}`,
  Edit: (id: string) => `${ACTIVITY_BASE}/task/${id}?mode=edit`,
  View: (id: string) => `${ACTIVITY_BASE}/task/${id}?mode=view`,
} as const;

// Appointment paths
const Appointment = {
  New: `${ACTIVITY_BASE}/appointment/new`,
  Detail: (id: string) => `${ACTIVITY_BASE}/appointment/${id}`,
  Edit: (id: string) => `${ACTIVITY_BASE}/appointment/${id}?mode=edit`,
  View: (id: string) => `${ACTIVITY_BASE}/appointment/${id}?mode=view`,
} as const;

// ==================== ACTIVITY PATHS ====================

export const Activity = {
  // List & Calendar
  List: ACTIVITY_BASE,
  ListMode: `${ACTIVITY_BASE}?view=list`,
  CalendarMode: `${ACTIVITY_BASE}?view=calendar`,

  // Sub-paths by type
  Email: Email,
  PhoneCall: PhoneCall,
  Task: Task,
  Appointment: Appointment,
} as const;

// ==================== ACTIVITY PATH HELPERS ====================

/** Get Activity New Path by Type */
export const getActivityNewPath = (type: ActivityTypeValue): string => {
  const paths: Record<ActivityTypeValue, string> = {
    [ActivityType.Email]: Email.New,
    [ActivityType.PhoneCall]: PhoneCall.New,
    [ActivityType.Task]: Task.New,
    [ActivityType.Appointment]: Appointment.New,
  };
  return paths[type] ?? ACTIVITY_BASE;
};

/** Get Activity Detail Path by Type */
export const getActivityDetailPath = (type: ActivityTypeValue, id: string): string => {
  const pathFns: Record<ActivityTypeValue, (id: string) => string> = {
    [ActivityType.Email]: Email.Detail,
    [ActivityType.PhoneCall]: PhoneCall.Detail,
    [ActivityType.Task]: Task.Detail,
    [ActivityType.Appointment]: Appointment.Detail,
  };
  return pathFns[type]?.(id) ?? ACTIVITY_BASE;
};

/** Get Activity Edit Path by Type */
export const getActivityEditPath = (type: ActivityTypeValue, id: string): string => {
  const pathFns: Record<ActivityTypeValue, (id: string) => string> = {
    [ActivityType.Email]: Email.Edit,
    [ActivityType.PhoneCall]: PhoneCall.Edit,
    [ActivityType.Task]: Task.Edit,
    [ActivityType.Appointment]: Appointment.Edit,
  };
  return pathFns[type]?.(id) ?? ACTIVITY_BASE;
};

/** Get Activity View Path by Type */
export const getActivityViewPath = (type: ActivityTypeValue, id: string): string => {
  const pathFns: Record<ActivityTypeValue, (id: string) => string> = {
    [ActivityType.Email]: Email.View,
    [ActivityType.PhoneCall]: PhoneCall.View,
    [ActivityType.Task]: Task.View,
    [ActivityType.Appointment]: Appointment.View,
  };
  return pathFns[type]?.(id) ?? ACTIVITY_BASE;
};

// ==================== ACCOUNT PATHS ====================

export const Account = {
  List: BasePaths.AccountPath,
  New: `${BasePaths.AccountPath}/new`,
  Detail: (id: string) => `${BasePaths.AccountPath}/${id}`,
  Edit: (id: string) => `${BasePaths.AccountPath}/${id}?mode=edit`,
  View: (id: string) => `${BasePaths.AccountPath}/${id}?mode=view`,
} as const;

// ==================== CONTACT PATHS ====================

export const Contact = {
  List: BasePaths.ContactPath,
  New: `${BasePaths.ContactPath}/new`,
  Detail: (id: string) => `${BasePaths.ContactPath}/${id}`,
  Edit: (id: string) => `${BasePaths.ContactPath}/${id}?mode=edit`,
  View: (id: string) => `${BasePaths.ContactPath}/${id}?mode=view`,
} as const;

// ==================== OPPORTUNITY PATHS ====================

export const Opportunity = {
  List: BasePaths.OpportunityPath,
  New: `${BasePaths.OpportunityPath}/new`,
  Detail: (id: string) => `${BasePaths.OpportunityPath}/${id}`,
  Edit: (id: string) => `${BasePaths.OpportunityPath}/${id}?mode=edit`,
  View: (id: string) => `${BasePaths.OpportunityPath}/${id}?mode=view`,
} as const;

// ==================== ALL PATHS (Combined Export) ====================

export const RoutePaths = {
  ...BasePaths,
  Activity: Activity,
  Lead: Lead,
  Account: Account,
  Contact: Contact,
  Opportunity: Opportunity,
} as const;

export default RoutePaths;