/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/Products/Dtos/**
 */

export interface ProductBrandItem {
  brandId: string;
  brandName?: string | null;
}

export interface ProductManufacturerItem {
  manufacturerId: string;
  manufacturerName?: string | null;
}

export interface ProductKeywordItem {
  id: string;
  keyword: string;
}

export interface ProductSkuItem {
  id: string;
  supplierAccountId: string;
  supplierAccountName?: string | null;
  sku: string;
}

export interface ProductDetailItem {
  id: string;
  code: string;
  name: string;
  shortDescription: string;
  detailedDescription?: string | null;
  validFrom: string;
  validUntil: string;
  unitOfMeasure?: string | null;
  manufacturerPartNumber?: string | null;
  model?: string | null;
  color?: string | null;
  productUrl?: string | null;
  quantityPerUnit?: number | null;
  deliveryDays: number;
  accountCodeId?: string | null;
  productCategoryId: string;
  productCategoryName?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  brands: ProductBrandItem[];
  manufacturers: ProductManufacturerItem[];
  keywords: ProductKeywordItem[];
  supplierSkus: ProductSkuItem[];
}

export interface ProductListItem {
  id: string;
  code: string;
  name: string;
  shortDescription?: string | null;
  productCategoryId: string;
  productCategoryName?: string | null;
  unitOfMeasure?: string | null;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface ProductListFilter {
  search?: string;
  productCategoryId?: string;
  isActive?: boolean;
}

export interface ProductFormSku {
  supplierAccountId: string;
  sku: string;
}

export interface ProductFormValues {
  id: string;
  code: string;
  name: string;
  shortDescription: string;
  detailedDescription?: string | null;
  validFrom: string;
  validUntil: string;
  unitOfMeasure?: string | null;
  manufacturerPartNumber?: string | null;
  model?: string | null;
  color?: string | null;
  productUrl?: string | null;
  quantityPerUnit?: number | null;
  deliveryDays: number;
  accountCodeId?: string | null;
  productCategoryId: string;
  isActive: boolean;
  brandIds: string[];
  manufacturerIds: string[];
  keywords: string[];
  supplierSkus: ProductFormSku[];
}
