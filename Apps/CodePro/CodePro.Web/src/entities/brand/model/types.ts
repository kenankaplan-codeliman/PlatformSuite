/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/Brands/Dtos/**
 */

export interface BrandDetailItem {
  id: string;
  name: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface BrandListItem {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface BrandListFilter {
  search?: string;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type BrandFormValues = Omit<BrandDetailItem, 'createdAt' | 'updatedAt'>;
