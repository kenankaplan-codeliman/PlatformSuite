/**
 * Backend DTO'ları ile birebir uyumlu — `Crm.Application/Features/Leads/Dtos/**`.
 */

export type LeadSource =
  | 'Other'
  | 'Website'
  | 'Email'
  | 'Phone'
  | 'Referral'
  | 'Advertisement'
  | 'SocialMedia'
  | 'Event'
  | 'PartnerNetwork';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Unqualified'
  | 'Converted';

export interface LeadDetailItem {
  id: string;
  subject: string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  source: LeadSource;
  status: LeadStatus;
  score?: number | null;
  estimatedValue?: number | null;
  description?: string | null;
  convertedAccountId?: string | null;
  convertedAccountName?: string | null;
  convertedContactId?: string | null;
  convertedContactName?: string | null;
  convertedAt?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LeadListItem {
  id: string;
  subject: string;
  fullName?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  source: LeadSource;
  status: LeadStatus;
  score?: number | null;
  estimatedValue?: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface LeadListFilter {
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type LeadFormValues = Omit<
  LeadDetailItem,
  'createdAt' | 'updatedAt' | 'convertedAccountName' | 'convertedContactName' | 'convertedAt'
>;
