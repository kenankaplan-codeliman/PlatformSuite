import { z } from 'zod';

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

/**
 * Lookup form alanları için zod şeması — backend'den dönen ekstra alanları
 * (yeni `entityType` değerleri vs.) reddetmemek için `passthrough` ve loose enum.
 */
export const entityReferenceSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    entityType: z.string().optional(),
    email: z.string().nullish(),
    phone: z.string().nullish(),
  })
  .passthrough();
