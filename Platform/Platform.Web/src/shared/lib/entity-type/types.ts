import type { ComponentType, CSSProperties, ReactNode } from 'react';
import type { EntityReference } from '../../types/EntityReference';

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
 * `EntityTypeMeta.quickCreate` render-prop'unun aldığı argümanlar. Lookup arama
 * modalı, "sonuç bulunamadı" alanından inline kayıt oluşturmayı tetiklediğinde
 * bu props ile descriptor'ı çağırır.
 *
 *  - `initialSearchText`: o anki arama metni; oluşturma formunda isim/başlık
 *    alanını ön-doldurmak için.
 *  - `onCreated`: kayıt başarıyla oluşturulunca yeni `EntityReference` ile çağrılır;
 *    lookup bu referansı seçili getirir.
 *  - `onCancel`: kullanıcı vazgeçince (geri) çağrılır; arama görünümüne dönülür.
 */
export interface QuickCreateRenderProps {
  initialSearchText?: string;
  onCreated: (ref: EntityReference) => void;
  onCancel: () => void;
}

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
  /**
   * Opsiyonel inline hızlı-kayıt formu. Tanımlıysa lookup arama modalının
   * "sonuç bulunamadı" alanında "+ Yeni <label>" butonu çıkar; tıklanınca modal
   * içeriği bu descriptor'ın döndürdüğü forma geçer (content-swap). Descriptor
   * kendi Kaydet/İptal aksiyonlarını render etmeli — modal ayrıca bir Modal AÇMAZ.
   *
   * App katmanında doldurulur (görsel meta listesi `shared`'da feature import
   * edemez); örn. `(p) => <AccountDetailPage embedded={p} />`.
   */
  quickCreate?: (props: QuickCreateRenderProps) => ReactNode;
}
