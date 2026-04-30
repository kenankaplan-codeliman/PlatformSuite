/**
 * Backend DTO'ları ile birebir uyumlu — Platform.Application/Features/AppUsers/Dtos/**
 */

export interface AppUserRoleItem {
  id: string;
  roleName: string;
  description?: string | null;
}

export interface AppUserDetailItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  organizationId: string;
  organizationName?: string | null;
  managerId?: string | null;
  managerName?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  roles: AppUserRoleItem[];
}

export interface AppUserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  organizationId: string;
  organizationName?: string | null;
  managerId?: string | null;
  managerName?: string | null;
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
  organizationId: string;
  managerId?: string | null;
  isActive: boolean;
}
