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

/**
 * Sistemde tanımlı tüm privilege code'larının entity bazında kataloğu
 * (backend: GetPrivilegeCatalog). Rol detay ekranı, rolün kendi seviyeleriyle
 * birleştirip "satır başı entity + yanında privilege'lar" görünümünü kurar.
 */
export interface PrivilegeCatalogEntry {
  code: string;
  action: string;
  /** DB'deki privilege_name — lokalizasyon yoksa yedek etiket. */
  name: string;
}

export interface PrivilegeCatalogGroup {
  entity: string;
  privileges: PrivilegeCatalogEntry[];
}
