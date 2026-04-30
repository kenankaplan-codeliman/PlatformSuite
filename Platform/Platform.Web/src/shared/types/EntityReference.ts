/**
 * Backend EntityReference ile uyumlu.
 * Lookup search sonuçları + polimorfik ilişkiler (RegardingEntity vb.) için ortak tip.
 */
export type ReferenceableEntityType = 'None' | 'User' | 'Account' | 'Contact';

export interface EntityReference {
  id: string;
  entityType: ReferenceableEntityType;
  name: string;
  email?: string | null;
  phone?: string | null;
}
