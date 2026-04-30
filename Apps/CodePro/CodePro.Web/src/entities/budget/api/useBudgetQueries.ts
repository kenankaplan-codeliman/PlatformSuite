import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
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

export function useBudgetListQuery(params: { pagination: PaginationRequest; filters: BudgetListFilter }) {
  return useQuery({ queryKey: budgetKeys.list(params), queryFn: () => budgetDataSource.list(params) });
}
