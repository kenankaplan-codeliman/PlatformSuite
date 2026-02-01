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


// ==================== ACTIVITY PATHS ====================
  // Activity routes
  export const Activity = {
    List: BasePaths.ActivityPath,
    
    // Email routes
    Email: {
      New: `${BasePaths.ActivityPath}/email/new`,
      Detail: (id: string) => `${BasePaths.ActivityPath}/email/${id}`,
      Edit: (id: string) => `${BasePaths.ActivityPath}/email/${id}`,
      View: (id: string) => `${BasePaths.ActivityPath}/email/${id}`,
    },
    
    // Phone Call routes
    PhoneCall: {
      New: `${BasePaths.ActivityPath}/phonecall/new`,
      Detail: (id: string) => `${BasePaths.ActivityPath}/phonecall/${id}`,
      Edit: (id: string) => `${BasePaths.ActivityPath}/phonecall/${id}`,
      View: (id: string) => `${BasePaths.ActivityPath}/phonecall/${id}`,
    },
    
    // Task routes
    Task: {
      New: `${BasePaths.ActivityPath}/task/new`,
      Detail: (id: string) => `${BasePaths.ActivityPath}/task/${id}`,
      Edit: (id: string) => `${BasePaths.ActivityPath}/task/${id}`,
      View: (id: string) => `${BasePaths.ActivityPath}/task/${id}`,
    },
    
    // Appointment routes
    Appointment: {
      New: `${BasePaths.ActivityPath}/appointment/new`,
      Detail: (id: string) => `${BasePaths.ActivityPath}/appointment/${id}`,
      Edit: (id: string) => `${BasePaths.ActivityPath}/appointment/${id}`,
      View: (id: string) => `${BasePaths.ActivityPath}/appointment/${id}`,
    },
  }as const;

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