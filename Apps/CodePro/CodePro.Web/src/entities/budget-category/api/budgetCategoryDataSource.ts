import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  BudgetCategoryDetailItem,
  BudgetCategoryFormValues,
  BudgetCategoryListFilter,
  BudgetCategoryListItem,
} from '../model/types';

interface BudgetCategoryListBody {
  pagination: PaginationRequest;
  filters: BudgetCategoryListFilter;
}

interface IdBody {
  id: string;
}

export const budgetCategoryDataSource = {
  list: async (
    body: BudgetCategoryListBody,
  ): Promise<PagedResult<BudgetCategoryListItem>> => {
    const response = await httpClient.post<PagedResult<BudgetCategoryListItem>>(
      CodeProServicePath.BudgetCategory.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<BudgetCategoryDetailItem> => {
    const response = await httpClient.post<BudgetCategoryDetailItem>(
      CodeProServicePath.BudgetCategory.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (
    values: BudgetCategoryFormValues,
  ): Promise<BudgetCategoryDetailItem> => {
    const response = await httpClient.post<BudgetCategoryDetailItem>(
      CodeProServicePath.BudgetCategory.Create,
      values,
    );
    return response.data;
  },

  update: async (
    values: BudgetCategoryFormValues,
  ): Promise<BudgetCategoryDetailItem> => {
    const response = await httpClient.post<BudgetCategoryDetailItem>(
      CodeProServicePath.BudgetCategory.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(
      CodeProServicePath.BudgetCategory.Delete,
      { id } satisfies IdBody,
    );
  },
};
