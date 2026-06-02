/**
 * Backend DTO'ları ile birebir uyumlu — `Crm.Application/Features/Leads/Dtos/**`.
 *
 * `source` / `status` GeneralParameter'a taşındı — düz string code olarak tutulur.
 * Geçerli değerler `useGeneralParameters('LeadSource' | 'LeadStatus')` ile çekilir.
 */

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
  source: string;
  status: string;
  score?: number | null;
  estimatedValue?: number | null;
  estimatedValueCurrency?: string | null;
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
  source: string;
  status: string;
  score?: number | null;
  estimatedValue?: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface LeadListFilter {
  search?: string;
  status?: string;
  source?: string;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type LeadFormValues = Omit<
  LeadDetailItem,
  'createdAt' | 'updatedAt' | 'convertedAccountName' | 'convertedContactName' | 'convertedAt'
>;
