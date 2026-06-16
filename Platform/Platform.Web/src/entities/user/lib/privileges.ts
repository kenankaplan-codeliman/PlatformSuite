import type { AccessLevel } from '../model/types';

/**
 * Bir entity'de kullanıcının okuma/yazma/güncelleme vb. privilege'lerinden
 * en az birinin `None` dışında bir seviyesi var mı?
 *
 * `entityKey` entity registry anahtarıdır ("Lead", "Account", "AppRole"...) ve
 * privilege kodlarının prefix'iyle eşleşir ("Lead.Read", "Lead.Create"...).
 * Tüm privilege'lar `None` ise (veya entity sözlükte hiç yoksa) `false` döner.
 */
export function canAccessEntity(
  entityKey: string,
  privileges: Record<string, AccessLevel> | undefined,
): boolean {
  if (!privileges) return false;
  const prefix = `${entityKey}.`;
  return Object.entries(privileges).some(
    ([code, level]) => code.startsWith(prefix) && level !== 'None',
  );
}
