/**
 * Backend DTO'ları ile birebir uyumlu — `Crm.Application/Features/Opportunities/Dtos/**`.
 *
 * `stage` GeneralParameter'a taşındı — düz string code olarak tutulur.
 * Geçerli değerler `useGeneralParameters('OpportunityStage')` ile çekilir.
 */

import type { EntityReference } from '@platform/ui';

/**
 * Opportunity satır kalemi — ürün ilişkisi EntityReference (ham Guid değil) ve
 * istemcide EntityLookupField ile düzenlenir. LineTotal sunucuda hesaplanır.
 * Para birimi parent opportunity.currency'den gelir — satır-seviyesi currency yok.
 */
export interface OpportunityProductModal {
  id: string;
  product?: EntityReference | null;
  quantity: number;
  unitPrice: number;
  /**
   * Ölçü birimi snapshot'ı (GeneralParameter code, parentCode: ProductUnitOfMeasure).
   * Ürün seçilince Product.UnitOfMeasure'dan otomatik prefill edilir; satırda değiştirilebilir.
   */
  unitCode?: string | null;
  /**
   * Satır indirim oranı (yüzde, 0-100). Önce uygulanır: brüt × rate/100.
   * Tutar cinsi indirim (discountAmount) bu adımdan sonra düşürülür.
   */
  discountRate: number;
  /**
   * Satır indirim tutarı (currency = parent opportunity.currency). Oran indirimden
   * SONRA brütten düşürülür. netAmount 0 altına düşmez (clamp).
   */
  discountAmount: number;
  // Server-computed; form input gerekmez, sadece display için döner.
  lineTotal?: number;
  // Server-computed: satır net tutarı (indirimler düşülmüş).
  netAmount?: number;
}

export interface OpportunityDetailItem {
  id: string;
  name: string;
  description?: string | null;
  account?: EntityReference | null;
  primaryContact?: EntityReference | null;
  stage: string;
  /** Kullanıcının girdiği tahmini tutar. */
  estimatedAmount?: number | null;
  /** Deal-level para birimi (CurrencyType code). estimatedAmount + actualAmount + tüm satırlar bu currency'de. */
  currency?: string | null;
  /** Sunucu hesaplar: products brüt satır toplamlarının toplamı. Form'da read-only. */
  actualAmount?: number | null;
  /** Sunucu hesaplar: satırların NetAmount (indirimler düşülmüş) toplamı. Form'da read-only. */
  actualNetAmount?: number | null;
  /** Sunucu hesaplar: satırların toplam indirim tutarı (oran cinsinden + tutar cinsinden). */
  totalDiscountAmount?: number | null;
  /** Sunucu hesaplar: efektif indirim oranı (%), totalDiscountAmount / actualAmount × 100. */
  totalDiscountRate?: number | null;
  probability: number;
  closeDate?: string | null;
  lossReason?: string | null;
  products: OpportunityProductModal[];
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OpportunityListItem {
  id: string;
  name: string;
  accountId: string;
  accountName?: string | null;
  stage: string;
  estimatedAmount?: number | null;
  actualAmount?: number | null;
  /** Deal currency (CurrencyType code) — amount kolonlarını anlamlı göstermek için liste'de de döner. */
  currency?: string | null;
  probability: number;
  closeDate?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface OpportunityListFilter {
  search?: string;
  stage?: string;
  accountId?: string;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type OpportunityFormValues = Omit<
  OpportunityDetailItem,
  'createdAt' | 'updatedAt'
>;
