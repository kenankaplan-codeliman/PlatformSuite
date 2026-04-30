/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/BudgetCategories/Dtos/**
 */

export interface BudgetCategoryDetailItem {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface BudgetCategoryListItem {
  id: string;
  name: string;
  code?: string | null;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
  isActive: boolean;
}

export interface BudgetCategoryListFilter {
  search?: string;
  parentCategoryId?: string | null;
  isActive?: boolean;
}

export interface BudgetCategoryFormValues {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  parentCategoryId?: string | null;
  isActive: boolean;
}
