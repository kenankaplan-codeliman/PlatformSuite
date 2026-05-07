import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { budgetKeys } from '../../../shared/api/queryKeys';
import { budgetDataSource } from './budgetDataSource';
import type { BudgetListFilter } from '../model/types';

export function useBudgetQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? budgetKeys.detail(id) : budgetKeys.detail('none'),
    queryFn: () => budgetDataSource.get(id!),
    enabled: !!id,
  });
}

export function useBudgetListQuery(params: { filters: BudgetListFilter; pageSize?: number }) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: budgetKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      budgetDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
