/**
 * Backend DTO'ları ile birebir uyumlu — `Crm.Application/Features/Products/Dtos/**`.
 *
 * `category` / `unitOfMeasure` / `unitPriceCurrency` GeneralParameter'a taşındı —
 * düz string code olarak tutulur (`useGeneralParameters('ProductCategory')` vb.).
 */

export interface ProductDetailItem {
  id: string;
  name: string;
  productCode: string;
  category?: string | null;
  unitPrice?: number | null;
  unitPriceCurrency?: string | null;
  unitOfMeasure?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProductListItem {
  id: string;
  name: string;
  productCode: string;
  category?: string | null;
  unitPrice?: number | null;
  unitPriceCurrency?: string | null;
  unitOfMeasure?: string | null;
  isActive: boolean;
}

export interface ProductListFilter {
  name?: string;
  productCode?: string;
  category?: string;
  isActive?: boolean;
}

/** Opportunity satır kalemi lookup'ında ürün seçilince dönen zenginleştirilmiş sonuç. */
export interface ProductLookupItem {
  id: string;
  name: string;
  productCode: string;
  unitPrice?: number | null;
  unitPriceCurrency?: string | null;
  unitOfMeasure?: string | null;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type ProductFormValues = Omit<ProductDetailItem, 'createdAt' | 'updatedAt'>;
