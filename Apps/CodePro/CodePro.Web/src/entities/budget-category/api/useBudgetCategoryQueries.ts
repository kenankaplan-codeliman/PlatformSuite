import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { budgetCategoryKeys } from '../../../shared/api/queryKeys';
import { budgetCategoryDataSource } from './budgetCategoryDataSource';
import type { BudgetCategoryListFilter } from '../model/types';

export function useBudgetCategoryQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? budgetCategoryKeys.detail(id) : budgetCategoryKeys.detail('none'),
    queryFn: () => budgetCategoryDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseBudgetCategoryListParams {
  pagination: PaginationRequest;
  filters: BudgetCategoryListFilter;
}

export function useBudgetCategoryListQuery(params: UseBudgetCategoryListParams) {
  return useQuery({
    queryKey: budgetCategoryKeys.list(params),
    queryFn: () => budgetCategoryDataSource.list(params),
  });
}
