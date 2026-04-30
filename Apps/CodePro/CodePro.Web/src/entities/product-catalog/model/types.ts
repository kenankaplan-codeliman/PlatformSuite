/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/ProductCatalogs/Dtos/**
 */

export interface ProductCatalogProductItem {
  productId: string;
  productCode?: string | null;
  productName?: string | null;
}

export interface ProductCatalogOrganizationItem {
  appOrganizationId: string;
  organizationName?: string | null;
}

export interface ProductCatalogDetailItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  validFrom: string;
  validUntil: string;
  priceCode?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  products: ProductCatalogProductItem[];
  organizations: ProductCatalogOrganizationItem[];
}

export interface ProductCatalogListItem {
  id: string;
  code: string;
  name: string;
  validFrom: string;
  validUntil: string;
  priceCode?: string | null;
  productCount: number;
  organizationCount: number;
  isActive: boolean;
}

export interface ProductCatalogListFilter {
  search?: string;
  isActive?: boolean;
}

export interface ProductCatalogFormValues {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  validFrom: string;
  validUntil: string;
  priceCode?: string | null;
  isActive: boolean;
  productIds: string[];
  organizationIds: string[];
}
