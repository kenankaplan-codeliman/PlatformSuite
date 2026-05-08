/**
 * Backend DTO'ları ile birebir uyumlu — `Platform.Application/Features/Accounts/Dtos/**`.
 */

import type { EntityReference } from '@platform/ui';

export type AccountStatus = 'Prospect' | 'Active' | 'AtRisk' | 'Inactive' | 'Churned';
export type AccountType = 'Customer' | 'Prospect' | 'Partner' | 'Vendor' | 'Competitor' | 'Other';
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
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  type: AddressType;
  isPrimary: boolean;
}

export interface AccountContactModal {
  id: string;
  contactId: string;
  contactName?: string | null;
  role?: string | null;
  isPrimary: boolean;
}

export interface AccountDetailItem {
  id: string;
  accountName: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  industry?: string | null;
  annualRevenue?: number | null;
  numberOfEmployees?: number | null;
  website?: string | null;
  description?: string | null;
  parentAccount?: EntityReference | null;
  emails: EmailModal[];
  phones: PhoneModal[];
  addresses: AddressModal[];
  contacts: AccountContactModal[];
  createdAt?: string | null;
  updatedAt?: string | null;
  isActive: boolean;
}

export interface AccountListItem {
  id: string;
  accountName: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  industry?: string | null;
  annualRevenue?: number | null;
  numberOfEmployees?: number | null;
  website?: string | null;
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  primaryCity?: string | null;
  isActive: boolean;
}

export interface AccountListFilter {
  accountName?: string;
  accountType?: AccountType;
  accountStatus?: AccountStatus;
  industry?: string;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type AccountFormValues = Omit<AccountDetailItem, 'createdAt' | 'updatedAt'>;
