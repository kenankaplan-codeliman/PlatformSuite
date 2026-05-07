import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
  filters: BudgetCategoryListFilter;
  pageSize?: number;
}

export function useBudgetCategoryListQuery(params: UseBudgetCategoryListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: budgetCategoryKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      budgetCategoryDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
