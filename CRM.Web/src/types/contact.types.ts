// Contact Types - Based on Contact.cs Entity

// =====================================================
// ENUMS
// Account entity ile aynı backend enum'larını paylaşır
// =====================================================

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

export interface ContactPhone {
  id?: string;
  phoneNumber: string;
  type: PhoneTypeValue;
  isPrimary: boolean;
}

export interface ContactEmail {
  id?: string;
  email: string;
  type: EmailTypeValue;
  isPrimary: boolean;
}

export interface ContactAddress {
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

// Contact → Account many-to-many ilişkisi (AccountContact junction tablosu)
export interface ContactAccountRef {
  id?: string;
  accountId: string;
  accountName?: string;
  role?: string;
  isPrimary: boolean;
}

// =====================================================
// MAIN INTERFACES
// =====================================================

export interface ContactListItem {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title?: string;
  department?: string;
  primaryAccount?: ContactAccountRef;
  primaryEmail?: string;
  primaryPhone?: string;
  isActive: boolean;
}

export interface ContactDetailItem {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  birthDate?: string;
  description?: string;

  // Many-to-many: bir kişi birden fazla firmaya bağlı olabilir
  accountContacts: ContactAccountRef[];

  emails: ContactEmail[];
  phones: ContactPhone[];
  addresses: ContactAddress[];

  createdAt?: Date;
  updatedAt?: Date;

  isActive: boolean;

}

// =====================================================
// REQUEST / RESPONSE
// =====================================================

export interface ContactListFilters {
  contactName?: string;
  accountId?: string;
  title?: string;
  department?: string;
  isActive?: boolean;
}

export interface ContactListRequest {
  page: number;
  pageSize: number;
  filters?: ContactListFilters;
}

export interface ContactListResponse {
  data: ContactListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
}

// =====================================================
// LABELS
// =====================================================

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
// HELPER FUNCTIONS
// =====================================================

export const getPhoneTypeLabel = (type: PhoneTypeValue): string =>
  PhoneTypeLabels[type] ?? 'Bilinmiyor';

export const getEmailTypeLabel = (type: EmailTypeValue): string =>
  EmailTypeLabels[type] ?? 'Bilinmiyor';

export const getAddressTypeLabel = (type: AddressTypeValue): string =>
  AddressTypeLabels[type] ?? 'Bilinmiyor';

export const getContactFullName = (
  contact: Pick<ContactDetailItem | ContactListItem, 'firstName' | 'lastName'>
): string => `${contact.firstName} ${contact.lastName}`.trim();

// =====================================================
// SELECT OPTIONS
// =====================================================

export const phoneTypeOptions = Object.entries(PhoneType).map(([, value]) => ({
  label: PhoneTypeLabels[value as PhoneTypeValue],
  value,
}));

export const emailTypeOptions = Object.entries(EmailType).map(([, value]) => ({
  label: EmailTypeLabels[value as EmailTypeValue],
  value,
}));

export const addressTypeOptions = Object.entries(AddressType).map(([, value]) => ({
  label: AddressTypeLabels[value as AddressTypeValue],
  value,
}));
