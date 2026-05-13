import type { ComponentType, CSSProperties } from 'react';

/**
 * Polimorfik referans anahtarı. Backend `EntityReference.EntityType` ile aynı —
 * 'Account', 'Contact', 'Supplier', 'User', ...
 */
export type EntityTypeKey = string;

/**
 * Semantik renk tonu. AntD Tag preset paletine eşlenir (bkz. `tone.ts`).
 * Palet değiştirmek istendiğinde tek noktadan (tone.ts) güncellenir; çağıran
 * kod ton ismini bilir, gerçek class/hex'i bilmez.
 */
export type EntityTone =
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'purple'
  | 'cyan'
  | 'magenta'
  | 'gold'
  | 'lime'
  | 'volcano'
  | 'geekblue'
  | 'default';

export type EntityIcon = ComponentType<{ className?: string; style?: CSSProperties }>;

/**
 * Bir entity türünün görsel + navigasyon metadata'sı. Menu, badge, lookup
 * tag'i, popup ve breadcrumb gibi yerlerde merkezî kaynak.
 *
 *  - `key`: polimorfik anahtar; case-insensitive eşleşir.
 *  - `label`: i18n anahtarı (caller `t(meta.label)` çağırır).
 *  - `icon`: AntD ikon component'i; sıfır arg veya `{ className, style }`.
 *  - `tone`: semantik renk; AntD Tag color preset'ine `tone.ts` map'ler.
 *  - `getDetailHref`: detail sayfasına navigasyon. Tanımsızsa link sarmalanmaz.
 *  - `servicePath`: lookup için entity-spesifik endpoint; yoksa `Reference.Lookup`.
 */
export interface EntityTypeMeta {
  key: EntityTypeKey;
  label: string;
  labelPlural?: string;
  icon: EntityIcon;
  tone: EntityTone;
  getDetailHref?: (id: string) => string;
  servicePath?: string;
}
