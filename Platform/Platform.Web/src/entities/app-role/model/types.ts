/**
 * Backend DTO'ları ile birebir uyumlu — Platform.Application/Features/AppRoles/Dtos/**
 */

export type AccessLevel = 'None' | 'User' | 'Organization' | 'All';

export interface AppRolePrivilegeItem {
  privilegeCode: string;
  accessLevel: AccessLevel;
}

export interface AppRoleDetailItem {
  id: string;
  roleName: string;
  description?: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  privileges: AppRolePrivilegeItem[];
}

export interface AppRoleListItem {
  id: string;
  roleName: string;
  description?: string | null;
  isDefault: boolean;
  isActive: boolean;
}

export interface AppRoleListFilter {
  roleName?: string;
  isActive?: boolean;
}

export interface AppRoleFormValues {
  id: string;
  roleName: string;
  description?: string | null;
  isDefault: boolean;
  isActive: boolean;
  privileges: AppRolePrivilegeItem[];
}
