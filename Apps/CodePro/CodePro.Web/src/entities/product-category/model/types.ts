/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/ProductCategories/Dtos/**
 */

export interface ProductCategoryDetailItem {
  id: string;
  name: string;
  title: string;
  code?: string | null;
  description?: string | null;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProductCategoryListItem {
  id: string;
  name: string;
  title: string;
  code?: string | null;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
  isActive: boolean;
}

export interface ProductCategoryListFilter {
  search?: string;
  parentCategoryId?: string | null;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export interface ProductCategoryFormValues {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  parentCategoryId?: string | null;
  isActive: boolean;
}
