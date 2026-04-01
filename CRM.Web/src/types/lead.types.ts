// Lead Types - Based on Lead.cs Entity
import i18n from '@/config/i18n.config';

export const LeadSource = {
  Web: 'web',
  Phone: 'phone',
  Email: 'email',
  Referral: 'referral',
  Partner: 'partner',
  Event: 'event',
  Campaign: 'campaign',
  Social: 'social',
  Other: 'other',
} as const;

export type LeadSourceValue = (typeof LeadSource)[keyof typeof LeadSource];

export const LeadStatus = {
  New: 'new',
  Contacted: 'contacted',
  Qualified: 'qualified',
  Unqualified: 'unqualified',
  Converted: 'converted',
} as const;

export type LeadStatusValue = (typeof LeadStatus)[keyof typeof LeadStatus];

export const LeadRating = {
  Cold: 'cold',
  Warm: 'warm',
  Hot: 'hot',
} as const;

export type LeadRatingValue = (typeof LeadRating)[keyof typeof LeadRating];



export interface LeadListItem {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobilePhone?: string;
  leadStatus: LeadStatusValue;
  leadSource: LeadSourceValue;
  leadRating: LeadRatingValue;
  industry: string;
  estimatedValue: number;
  isActive: boolean;
}

export interface LeadDetailItem {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  website?: string;
  address?: string;

  description?: string;

  industry?: string;
  numberOfEmployees?: number;

  leadSource: LeadSourceValue;
  leadStatus: LeadStatusValue;
  leadRating: LeadRatingValue;

  annualRevenue?: number;
  estimatedValue?: number;

  createdAt?: Date;
  updatedAt?: Date;
  convertedDate?: Date;

  isActive: boolean;
}

export interface LeadListFilters {
  companyName?: string;
  firstName?: string;
  lastName?: string;
  leadStatus?: LeadStatusValue;
  leadSource?: LeadSourceValue;
  leadRating?: LeadRatingValue;
  industry?: string;
  isActive?: boolean;
}

export interface LeadListRequest {
  page: number;
  pageSize: number;
  filters?: LeadListFilters;
}

export interface LeadListResponse {
  data: LeadListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
}

export interface LeadBulkUpdateStatusRequest {
  ids: string[];
  status: LeadStatusValue;
}

// Color maps
const LeadStatusColors: Record<LeadStatusValue, string> = {
  [LeadStatus.New]: 'blue',
  [LeadStatus.Contacted]: 'cyan',
  [LeadStatus.Qualified]: 'green',
  [LeadStatus.Unqualified]: 'red',
  [LeadStatus.Converted]: 'purple',
};

const LeadRatingColors: Record<LeadRatingValue, string> = {
  [LeadRating.Cold]: 'default',
  [LeadRating.Warm]: 'orange',
  [LeadRating.Hot]: 'red',
};

// Helper functions
export const getLeadSourceLabel = (source: LeadSourceValue): string =>
  i18n.t(`enums:leadSource.${source}`, { defaultValue: source });

export const getLeadStatusLabel = (status: LeadStatusValue): string =>
  i18n.t(`enums:leadStatus.${status}`, { defaultValue: status });

export const getLeadRatingLabel = (rating: LeadRatingValue): string =>
  i18n.t(`enums:leadRating.${rating}`, { defaultValue: rating });

export const getLeadStatusColor = (status: LeadStatusValue): string => {
  return LeadStatusColors[status] ?? 'default';
};

export const getLeadRatingColor = (rating: LeadRatingValue): string => {
  return LeadRatingColors[rating] ?? 'default';
};

// Options for Select components
export const leadSourceOptions = Object.values(LeadSource).map((value) => ({
  label: getLeadSourceLabel(value),
  value,
}));

export const leadStatusOptions = Object.values(LeadStatus).map((value) => ({
  label: getLeadStatusLabel(value),
  value,
}));

export const leadRatingOptions = Object.values(LeadRating).map((value) => ({
  label: getLeadRatingLabel(value),
  value,
}));

// Table filter options (for Ant Design Table column filters)
export const leadStatusFilters = Object.values(LeadStatus).map((value) => ({
  text: getLeadStatusLabel(value),
  value,
}));

export const leadRatingFilters = Object.values(LeadRating).map((value) => ({
  text: getLeadRatingLabel(value),
  value,
}));

export const leadSourceFilters = Object.values(LeadSource).map((value) => ({
  text: getLeadSourceLabel(value),
  value,
}));