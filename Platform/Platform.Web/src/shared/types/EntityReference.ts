import { z } from 'zod';

/**
 * Backend `EntityReference` ile uyumlu generic referans tipi.
 *
 * `entityType` bilinçli olarak `string` — Account/Contact/User dışında
 * uygulamaya özel entity'ler de (CodePro `Product`, `PriceList`, vb.)
 * kendi tip isimlerini taşıyabilir. Discriminator gerektiren yerlerde
 * (Activity attendees, RegardingEntity) string literal karşılaştırma
 * yapılabilir; basit lookup'larda alan görmezden gelinebilir.
 */
export interface EntityReference {
  id: string;
  entityType: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

/**
 * Lookup form alanları için zod şeması. `entityType` ve ekstra alanlar
 * bilinçli olarak loose — backend'in göndereceği tüm uygulamaya özel
 * değerleri kabul eder. Inferred tip `EntityReference` ile birebir.
 */
export const entityReferenceSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    entityType: z.string(),
    email: z.string().nullish(),
    phone: z.string().nullish(),
  })
  .passthrough();
