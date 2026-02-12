// Account Types - Based on Account.cs Entity

// =====================================================
// ENUMS
// =====================================================

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
// LABELS
// =====================================================

const AccountTypeLabels: Record<AccountTypeValue, string> = {
  [AccountType.Customer]: 'Müşteri',
  [AccountType.Prospect]: 'Potansiyel',
  [AccountType.Partner]: 'İş Ortağı',
  [AccountType.Vendor]: 'Tedarikçi',
  [AccountType.Competitor]: 'Rakip',
  [AccountType.Other]: 'Diğer',
};

const PhoneTypeLabels: Record<PhoneTypeValue, string> = {
  [PhoneType.Work]: 'İş',
  [PhoneType.Mobile]: 'Mobil',
  [PhoneType.Fax]: 'Faks',
  [PhoneType.Home]: 'Ev',
  [PhoneType.Other]: 'Diğer',
};

const EmailTypeLabels: Record<EmailTypeValue, string> = {
  [EmailType.Work]: 'İş',
  [EmailType.Personal]: 'Kişisel',
  [EmailType.Billing]: 'Fatura',
  [EmailType.Support]: 'Destek',
  [EmailType.Other]: 'Diğer',
};

const AddressTypeLabels: Record<AddressTypeValue, string> = {
  [AddressType.Billing]: 'Fatura',
  [AddressType.Shipping]: 'Sevkiyat',
  [AddressType.Office]: 'Ofis',
  [AddressType.Other]: 'Diğer',
};





// =====================================================
// COLORS
// =====================================================

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

export const getAccountTypeLabel = (type: AccountTypeValue): string => {
  return AccountTypeLabels[type] ?? 'Bilinmiyor';
};

export const getAccountTypeColor = (type: AccountTypeValue): string => {
  return AccountTypeColors[type] ?? 'default';
};

export const getPhoneTypeLabel = (type: PhoneTypeValue): string => {
  return PhoneTypeLabels[type] ?? 'Bilinmiyor';
};

export const getEmailTypeLabel = (type: EmailTypeValue): string => {
  return EmailTypeLabels[type] ?? 'Bilinmiyor';
};

export const getAddressTypeLabel = (type: AddressTypeValue): string => {
  return AddressTypeLabels[type] ?? 'Bilinmiyor';
};

// =====================================================
// SELECT OPTIONS
// =====================================================

export const accountTypeOptions = Object.entries(AccountType).map(([, value]) => ({
  label: AccountTypeLabels[value as AccountTypeValue],
  value: value,
}));

export const phoneTypeOptions = Object.entries(PhoneType).map(([, value]) => ({
  label: PhoneTypeLabels[value as PhoneTypeValue],
  value: value,
}));

export const emailTypeOptions = Object.entries(EmailType).map(([, value]) => ({
  label: EmailTypeLabels[value as EmailTypeValue],
  value: value,
}));

export const addressTypeOptions = Object.entries(AddressType).map(([, value]) => ({
  label: AddressTypeLabels[value as AddressTypeValue],
  value: value,
}));

// =====================================================
// TABLE FILTER OPTIONS
// =====================================================

export const accountTypeFilters = Object.entries(AccountType).map(([, value]) => ({
  text: AccountTypeLabels[value as AccountTypeValue],
  value: value,
}));
