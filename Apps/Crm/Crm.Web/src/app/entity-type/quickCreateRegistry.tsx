import type { ReactNode } from "react";
import type { EntityTypeMeta, QuickCreateRenderProps } from "@platform/ui";
import { crmEntityTypes } from "../../shared/entity-type/crmEntityTypes";
import { AccountDetailPage } from "../../pages/accounts/detail/ui/AccountDetailPage";
import { ContactDetailPage } from "../../pages/contacts/detail/ui/ContactDetailPage";
import { LeadDetailPage } from "../../pages/leads/detail/ui/LeadDetailPage";
import { OpportunityDetailPage } from "../../pages/opportunities/detail/ui/OpportunityDetailPage";
import { ProductDetailPage } from "../../pages/products/detail/ui/ProductDetailPage";

/**
 * Entity tipi anahtarı → o entity'nin MEVCUT Detail Page'ini embedded (modal-içi)
 * modda açan quick-create render fonksiyonu. Lookup arama modalı "sonuç bulunamadı"
 * alanında, tip bu map'te varsa "+ Yeni <label>" butonu gösterir ve content-swap
 * ile burada render edilen formu açar. Alanlar kopyalanmaz — tek kaynak (detail
 * page) korunur.
 *
 * Yeni bir CRM entity'sini quick-create'e açmak için:
 *  1) İlgili `XDetailPage`'in opsiyonel `embedded?: QuickCreateRenderProps` prop'unu
 *     kabul ettiğinden ve `DetailPageLayout`'a `embedded` + `embeddedReferenceName`
 *     geçtiğinden emin ol.
 *  2) Bu map'e tek satır ekle.
 *  3) O entity'i hedefleyen `EntityLookupField`'lara `entityType` prop'u ver
 *     (registry eşleşmesi butonu görünür kılar).
 */
const quickCreatePages: Record<
  string,
  (props: QuickCreateRenderProps) => ReactNode
> = {
  Account: (props) => <AccountDetailPage embedded={props} />,
  Contact: (props) => <ContactDetailPage embedded={props} />,
  Lead: (props) => <LeadDetailPage embedded={props} />,
  Opportunity: (props) => <OpportunityDetailPage embedded={props} />,
  Product: (props) => <ProductDetailPage embedded={props} />,
};

/**
 * Görsel meta (`crmEntityTypes`, shared) + opt-in inline quick-create formlarının
 * app-katmanı birleşimi.
 *
 * Neden app-katmanı: `shared/entity-type/crmEntityTypes.ts` bir sayfa/feature
 * import edemez (FSD: shared → feature ters bağımlılık). Wiring burada yapılır,
 * shared saf görsel meta kalır.
 */
export const crmEntityTypesWithQuickCreate: EntityTypeMeta[] = crmEntityTypes.map(
  (meta) => {
    const quickCreate = quickCreatePages[meta.key];
    return quickCreate ? { ...meta, quickCreate } : meta;
  },
);
