/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/PriceLists/Dtos/**
 */

export interface PriceListDetailItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  supplierAccountId: string;
  supplierAccountName?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PriceListListItem {
  id: string;
  code: string;
  name: string;
  supplierAccountId: string;
  supplierAccountName?: string | null;
  isActive: boolean;
}

export interface PriceListListFilter {
  search?: string;
  supplierAccountId?: string;
  isActive?: boolean;
}

export interface PriceListFormValues {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  supplierAccountId: string;
  isActive: boolean;
}
