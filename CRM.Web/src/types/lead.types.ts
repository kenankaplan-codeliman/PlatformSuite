// Lead Types - Based on Lead.cs Entity

export const LeadSource = {
  Web: 0,
  Phone: 1,
  Email: 2,
  Referral: 3,
  Partner: 4,
  Event: 5,
  Campaign: 6,
  Social: 7,
  Other: 8,
} as const;

export type LeadSourceValue = (typeof LeadSource)[keyof typeof LeadSource];

export const LeadStatus = {
  New: 0,
  Contacted: 1,
  Qualified: 2,
  Unqualified: 3,
  Converted: 4,
} as const;

export type LeadStatusValue = (typeof LeadStatus)[keyof typeof LeadStatus];

export const LeadRating = {
  Cold: 0,
  Warm: 1,
  Hot: 2,
} as const;

export type LeadRatingValue = (typeof LeadRating)[keyof typeof LeadRating];

export interface Lead {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  website?: string;
  leadSource: LeadSourceValue;
  leadStatus: LeadStatusValue;
  leadRating: LeadRatingValue;
  industry?: string;
  numberOfEmployees?: number;
  annualRevenue?: number;
  estimatedValue?: number;
  description?: string;
  address?: string;
  convertedDate?: string;
  convertedAccountId?: string;
  convertedContactId?: string;
  convertedOpportunityId?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: string;
  ownerId: string;
  organizationId: string;
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
  data: Lead[];
  total: number;
  page: number;
  pageSize: number;
}

// Label maps
const LeadSourceLabels: Record<LeadSourceValue, string> = {
  [LeadSource.Web]: 'Web',
  [LeadSource.Phone]: 'Telefon',
  [LeadSource.Email]: 'E-posta',
  [LeadSource.Referral]: 'Referans',
  [LeadSource.Partner]: 'İş Ortağı',
  [LeadSource.Event]: 'Etkinlik',
  [LeadSource.Campaign]: 'Kampanya',
  [LeadSource.Social]: 'Sosyal Medya',
  [LeadSource.Other]: 'Diğer',
};

const LeadStatusLabels: Record<LeadStatusValue, string> = {
  [LeadStatus.New]: 'Yeni',
  [LeadStatus.Contacted]: 'İletişime Geçildi',
  [LeadStatus.Qualified]: 'Nitelikli',
  [LeadStatus.Unqualified]: 'Niteliksiz',
  [LeadStatus.Converted]: 'Dönüştürüldü',
};

const LeadRatingLabels: Record<LeadRatingValue, string> = {
  [LeadRating.Cold]: 'Soğuk',
  [LeadRating.Warm]: 'Ilık',
  [LeadRating.Hot]: 'Sıcak',
};

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

// Helper functions - all accept VALUE (number) as parameter
export const getLeadSourceLabel = (source: LeadSourceValue): string => {
  return LeadSourceLabels[source] ?? 'Bilinmiyor';
};

export const getLeadStatusLabel = (status: LeadStatusValue): string => {
  return LeadStatusLabels[status] ?? 'Bilinmiyor';
};

export const getLeadRatingLabel = (rating: LeadRatingValue): string => {
  return LeadRatingLabels[rating] ?? 'Bilinmiyor';
};

export const getLeadStatusColor = (status: LeadStatusValue): string => {
  return LeadStatusColors[status] ?? 'default';
};

export const getLeadRatingColor = (rating: LeadRatingValue): string => {
  return LeadRatingColors[rating] ?? 'default';
};

// Options for Select components (pre-built for convenience)
export const leadSourceOptions = Object.entries(LeadSource).map(([, value]) => ({
  label: LeadSourceLabels[value as LeadSourceValue],
  value: value,
}));

export const leadStatusOptions = Object.entries(LeadStatus).map(([, value]) => ({
  label: LeadStatusLabels[value as LeadStatusValue],
  value: value,
}));

export const leadRatingOptions = Object.entries(LeadRating).map(([, value]) => ({
  label: LeadRatingLabels[value as LeadRatingValue],
  value: value,
}));

// Table filter options (for Ant Design Table column filters)
export const leadStatusFilters = Object.entries(LeadStatus).map(([, value]) => ({
  text: LeadStatusLabels[value as LeadStatusValue],
  value: value,
}));

export const leadRatingFilters = Object.entries(LeadRating).map(([, value]) => ({
  text: LeadRatingLabels[value as LeadRatingValue],
  value: value,
}));

export const leadSourceFilters = Object.entries(LeadSource).map(([, value]) => ({
  text: LeadSourceLabels[value as LeadSourceValue],
  value: value,
}));