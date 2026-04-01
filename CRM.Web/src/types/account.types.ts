// Account Types - Based on Account.cs Entity
import i18n from '@/config/i18n.config';

// =====================================================
// ENUMS
// =====================================================

export const AccountStatus = {
  Prospect: 'prospect',
  Active: 'active',
  AtRisk: 'atRisk',
  Inactive: 'inactive',
  Churned: 'churned',
} as const;

export type AccountStatusValue = (typeof AccountStatus)[keyof typeof AccountStatus];

export const AccountType = {
  Customer: 'customer',
  Prospect: 'prospect',
  Partner: 'partner',
  Vendor: 'vendor',
  Competitor: 'competitor',
  Other: 'other',
} as const;

export type AccountTypeValue = (typeof AccountType)[keyof typeof AccountType];

export const PhoneType = {
  Work: 'work',
  Mobile: 'mobile',
  Fax: 'fax',
  Home: 'home',
  Other: 'other',
} as const;

export type PhoneTypeValue = (typeof PhoneType)[keyof typeof PhoneType];

export const EmailType = {
  Work: 'work',
  Personal: 'personal',
  Billing: 'billing',
  Support: 'support',
  Other: 'other',
} as const;

export type EmailTypeValue = (typeof EmailType)[keyof typeof EmailType];

export const AddressType = {
  Billing: 'billing',
  Shipping: 'shipping',
  Office: 'office',
  Other: 'other',
} as const;

export type AddressTypeValue = (typeof AddressType)[keyof typeof AddressType];

// =====================================================
// SUB-ENTITY INTERFACES
// =====================================================

export interface AccountPhone {
  id?: string;
  phoneNumber: string;
  type: PhoneTypeValue;
  isPrimary: boolean;
}

export interface AccountEmail {
  id?: string;
  email: string;
  type: EmailTypeValue;
  isPrimary: boolean;
}

export interface AccountAddress {
  id?: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  type: AddressTypeValue;
  isPrimary: boolean;
}

export interface AccountContactRef {
  id?: string;
  contactId: string;
  contactName?: string;
  role?: string;
  isPrimary: boolean;
}

// =====================================================
// MAIN INTERFACES
// =====================================================

export interface AccountListItem {
  id: string;
  accountName: string;
  accountType: AccountTypeValue;
  accountStatus?: AccountStatusValue;
  industry?: string;
  annualRevenue?: number;
  numberOfEmployees?: number;
  website?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  primaryCity?: string;
  isActive: boolean;
}

export interface AccountDetailItem {
  id: string;
  accountName: string;
  accountType: AccountTypeValue;
  accountStatus?: AccountStatusValue;
  industry?: string;
  annualRevenue?: number;
  numberOfEmployees?: number;
  website?: string;
  description?: string;

  parentAccountId?: string;
  parentAccountName?: string;

  emails: AccountEmail[];
  phones: AccountPhone[];
  addresses: AccountAddress[];
  contacts: AccountContactRef[];

  createdAt?: Date;
  updatedAt?: Date;

  isActive: boolean;
}

// =====================================================
// REQUEST / RESPONSE
// =====================================================

export interface AccountListFilters {
  accountName?: string;
  accountType?: AccountTypeValue;
  industry?: string;
  isActive?: boolean;
}

export interface AccountListRequest {
  page: number;
  pageSize: number;
  filters?: AccountListFilters;
}

export interface AccountListResponse {
  data: AccountListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
}



// =====================================================
// COLORS
// =====================================================

// =====================================================
// COLORS
// =====================================================

const AccountStatusColors: Record<AccountStatusValue, string> = {
  [AccountStatus.Prospect]: 'blue',
  [AccountStatus.Active]: 'green',
  [AccountStatus.AtRisk]: 'orange',
  [AccountStatus.Inactive]: 'default',
  [AccountStatus.Churned]: 'red',
};

const AccountTypeColors: Record<AccountTypeValue, string> = {
  [AccountType.Customer]: 'green',
  [AccountType.Prospect]: 'blue',
  [AccountType.Partner]: 'purple',
  [AccountType.Vendor]: 'orange',
  [AccountType.Competitor]: 'red',
  [AccountType.Other]: 'default',
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const getAccountStatusLabel = (status: AccountStatusValue): string =>
  i18n.t(`enums:accountStatus.${status}`, { defaultValue: status });

export const getAccountStatusColor = (status: AccountStatusValue): string =>
  AccountStatusColors[status] ?? 'default';

export const getAccountTypeLabel = (type: AccountTypeValue): string =>
  i18n.t(`enums:accountType.${type}`, { defaultValue: type });

export const getAccountTypeColor = (type: AccountTypeValue): string =>
  AccountTypeColors[type] ?? 'default';

export const getPhoneTypeLabel = (type: PhoneTypeValue): string =>
  i18n.t(`enums:phoneType.${type}`, { defaultValue: type });

export const getEmailTypeLabel = (type: EmailTypeValue): string =>
  i18n.t(`enums:emailType.${type}`, { defaultValue: type });

export const getAddressTypeLabel = (type: AddressTypeValue): string =>
  i18n.t(`enums:addressType.${type}`, { defaultValue: type });

// =====================================================
// SELECT OPTIONS
// =====================================================

export const accountStatusOptions = Object.values(AccountStatus).map((value) => ({
  label: getAccountStatusLabel(value),
  value,
}));

export const accountTypeOptions = Object.values(AccountType).map((value) => ({
  label: getAccountTypeLabel(value),
  value,
}));

export const phoneTypeOptions = Object.values(PhoneType).map((value) => ({
  label: getPhoneTypeLabel(value),
  value,
}));

export const emailTypeOptions = Object.values(EmailType).map((value) => ({
  label: getEmailTypeLabel(value),
  value,
}));

export const addressTypeOptions = Object.values(AddressType).map((value) => ({
  label: getAddressTypeLabel(value),
  value,
}));

// =====================================================
// TABLE FILTER OPTIONS
// =====================================================

export const accountTypeFilters = Object.values(AccountType).map((value) => ({
  text: getAccountTypeLabel(value),
  value,
}));
