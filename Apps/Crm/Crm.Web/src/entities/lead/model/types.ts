/**
 * Backend DTO'ları ile birebir uyumlu — `Crm.Application/Features/Leads/Dtos/**`.
 *
 * `source` / `status` / `rating` GeneralParameter'a taşındı — düz string code olarak tutulur.
 * Geçerli değerler `useGeneralParameters('LeadSource' | 'LeadStatus' | 'LeadRating')` ile çekilir.
 *
 * İletişim (email/telefon/adres) Account/Contact ile aynı polimorfik Communications modeli.
 * Cross-entity import yasağı nedeniyle modal tipleri burada (entity'ye özel) yeniden tanımlanır.
 */

export type EmailType = 'Work' | 'Personal' | 'Billing' | 'Support' | 'Other';
export type PhoneType = 'Mobile' | 'Work' | 'Home' | 'Fax' | 'Other';
export type AddressType = 'Billing' | 'Shipping' | 'Office' | 'Other';

export interface EmailModal {
  id: string;
  email: string;
  type: EmailType;
  isPrimary: boolean;
}

export interface PhoneModal {
  id: string;
  phoneNumber: string;
  type: PhoneType;
  isPrimary: boolean;
}

export interface AddressModal {
  id?: string;
  addressLine1: string;
  addressLine2?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  cityCode?: string | null;
  cityName?: string | null;
  districtCode?: string | null;
  districtName?: string | null;
  state?: string | null;
  postalCode?: string | null;
  type: AddressType;
  isPrimary: boolean;
}

export interface LeadDetailItem {
  id: string;
  subject: string;
  // Kişi bilgisi
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  department?: string | null;
  // Firma bilgisi
  company?: string | null;
  industry?: string | null;
  website?: string | null;
  source: string;
  status: string;
  rating?: string | null;
  score?: number | null;
  estimatedValue?: number | null;
  estimatedValueCurrency?: string | null;
  description?: string | null;
  // İletişim
  emails: EmailModal[];
  phones: PhoneModal[];
  addresses: AddressModal[];
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
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  source: string;
  status: string;
  rating?: string | null;
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

/** Convert isteği — `ConvertLeadCommand` ile birebir. */
export interface ConvertLeadInput {
  id: string;
  createAccount: boolean;
  /** Mevcut firmaya bağlama — doluysa yeni firma oluşturulmaz. */
  accountId?: string | null;
  createContact: boolean;
  createOpportunity: boolean;
}

/** Convert sonucu — `ConvertLeadResult` ile birebir. */
export interface ConvertLeadResult {
  leadId: string;
  accountId?: string | null;
  contactId?: string | null;
  opportunityId?: string | null;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type LeadFormValues = Omit<
  LeadDetailItem,
  'createdAt' | 'updatedAt' | 'convertedAccountName' | 'convertedContactName' | 'convertedAt'
>;
