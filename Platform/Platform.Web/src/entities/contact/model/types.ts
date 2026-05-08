/**
 * Backend DTO'ları ile birebir uyumlu — `Platform.Application/Features/Contacts/Dtos/**`.
 */

import type {
  AddressModal,
  EmailModal,
  PhoneModal,
} from '../../account/model/types';

export type ContactStatus = 'Active' | 'DoNotContact' | 'Unsubscribed' | 'Inactive';

/** `ContactAccountModal` (Account ↔ Contact köprüsü, Contact tarafından bakış). */
export interface ContactAccountModal {
  id: string;
  accountId: string;
  accountName?: string | null;
  role?: string | null;
  isPrimary: boolean;
}

export interface ContactDetailItem {
  id: string;
  firstName: string;
  lastName: string;
  contactStatus: ContactStatus;
  title?: string | null;
  department?: string | null;
  birthDate?: string | null;
  description?: string | null;
  accountContacts: ContactAccountModal[];
  emails: EmailModal[];
  phones: PhoneModal[];
  addresses: AddressModal[];
  createdAt?: string | null;
  updatedAt?: string | null;
  isActive: boolean;
}

export interface ContactListItem {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  contactStatus: ContactStatus;
  title?: string | null;
  department?: string | null;
  primaryAccount?: ContactAccountModal | null;
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  isActive: boolean;
}

export interface ContactListFilter {
  contactName?: string;
  accountId?: string;
  contactStatus?: ContactStatus;
  title?: string;
  department?: string;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type ContactFormValues = Omit<ContactDetailItem, 'createdAt' | 'updatedAt'>;
