// Contact Types - Based on Contact.cs Entity
import i18n from '@/config/i18n.config';

// =====================================================
// ENUMS
// Account entity ile aynı backend enum'larını paylaşır
// =====================================================

export const ContactStatus = {
  Active: 'active',
  DoNotContact: 'doNotContact',
  Unsubscribed: 'unsubscribed',
  Inactive: 'inactive',
} as const;

export type ContactStatusValue = (typeof ContactStatus)[keyof typeof ContactStatus];

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
  contactStatus?: ContactStatusValue;
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
  contactStatus?: ContactStatusValue;
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
// COLORS
// =====================================================

const ContactStatusColors: Record<ContactStatusValue, string> = {
  [ContactStatus.Active]: 'green',
  [ContactStatus.DoNotContact]: 'red',
  [ContactStatus.Unsubscribed]: 'orange',
  [ContactStatus.Inactive]: 'default',
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const getContactStatusLabel = (status: ContactStatusValue): string =>
  i18n.t(`enums:contactStatus.${status}`, { defaultValue: status });

export const getContactStatusColor = (status: ContactStatusValue): string =>
  ContactStatusColors[status] ?? 'default';

export const getPhoneTypeLabel = (type: PhoneTypeValue): string =>
  i18n.t(`enums:phoneType.${type}`, { defaultValue: type });

export const getEmailTypeLabel = (type: EmailTypeValue): string =>
  i18n.t(`enums:emailType.${type}`, { defaultValue: type });

export const getAddressTypeLabel = (type: AddressTypeValue): string =>
  i18n.t(`enums:addressType.${type}`, { defaultValue: type });

export const getContactFullName = (
  contact: Pick<ContactDetailItem | ContactListItem, 'firstName' | 'lastName'>
): string => `${contact.firstName} ${contact.lastName}`.trim();

// =====================================================
// SELECT OPTIONS
// =====================================================

export const contactStatusOptions = Object.values(ContactStatus).map((value) => ({
  label: getContactStatusLabel(value),
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
