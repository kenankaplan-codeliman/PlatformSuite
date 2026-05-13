import type { EntityReference } from '../../../shared/types/EntityReference';

/**
 * Backend DTO'ları ile birebir uyumlu — Platform.Application/Features/AppUsers/Dtos/**
 * Organization ve Manager EntityReference shape'inde gelir; EntityLookupField
 * doğrudan tüketir.
 */

export interface AppUserDetailItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  organization: EntityReference | null;
  manager: EntityReference | null;
  /**
   * Kullanıcının rolleri (entityType="AppRole"). Detail page'de
   * EntityLookupField multiple ile düzenlenir.
   */
  roles: EntityReference[];
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AppUserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  organization: EntityReference | null;
  manager: EntityReference | null;
  isActive: boolean;
}

export interface AppUserListFilter {
  fullName?: string;
  email?: string;
  organizationId?: string;
  isActive?: boolean;
}

export interface AppUserFormValues {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  organization: EntityReference | null;
  manager: EntityReference | null;
  roles: EntityReference[];
  isActive: boolean;
}
