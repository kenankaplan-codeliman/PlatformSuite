/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/ProductPrices/Dtos/**
 */

export interface ProductPriceDetailItem {
  id: string;
  productId: string;
  productName?: string | null;
  supplierAccountId: string;
  supplierAccountName?: string | null;
  priceListId?: string | null;
  priceListName?: string | null;
  minimumQuantity: number;
  validFrom: string;
  validUntil: string;
  unitPrice: number;
  currency: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProductPriceListItem {
  id: string;
  productId: string;
  productCode?: string | null;
  productName?: string | null;
  supplierAccountId: string;
  supplierAccountName?: string | null;
  priceListId?: string | null;
  priceListName?: string | null;
  minimumQuantity: number;
  unitPrice: number;
  currency: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface ProductPriceListFilter {
  productId?: string;
  supplierAccountId?: string;
  priceListId?: string;
  isActive?: boolean;
}

export interface ProductPriceFormValues {
  id: string;
  productId: string;
  supplierAccountId: string;
  priceListId?: string | null;
  minimumQuantity: number;
  validFrom: string;
  validUntil: string;
  unitPrice: number;
  currency: string;
  isActive: boolean;
}
