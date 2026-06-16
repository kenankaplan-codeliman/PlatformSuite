import type {
  AccessLevel,
  AppRolePrivilegeItem,
  PrivilegeCatalogGroup,
} from '../model/types';

export const ACCESS_LEVELS: AccessLevel[] = [
  'None',
  'User',
  'Organization',
  'All',
];

/**
 * Privilege kataloğunu (tüm entity/eylem code'ları) rolün kendi atanmış
 * seviyeleriyle birleştirip form'un `privileges` dizisini üretir. Katalog
 * sırasını korur; role'de bulunmayan code'lar `None` ile doldurulur. Böylece
 * form dizisi her zaman tam kataloğu içerir ve dizi index'i = katalog pozisyonu
 * (RolePrivilegesSection field binding'i bu sıraya dayanır).
 */
export function buildPrivilegeFormList(
  catalog: PrivilegeCatalogGroup[],
  assigned: AppRolePrivilegeItem[],
): AppRolePrivilegeItem[] {
  const byCode = new Map(assigned.map((p) => [p.privilegeCode, p.accessLevel]));
  return catalog.flatMap((group) =>
    group.privileges.map((entry) => ({
      privilegeCode: entry.code,
      accessLevel: byCode.get(entry.code) ?? 'None',
    })),
  );
}
