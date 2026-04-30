import { useQuery } from '@tanstack/react-query';
import { accountDataSource } from './accountDataSource';
import { accountKeys } from '../../../shared/api/queryKeys';
import type { PaginationRequest } from '../../../shared/types/Pagination';
import type { AccountListFilter } from '../model/types';

export function useAccountQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? accountKeys.detail(id) : accountKeys.detail('none'),
    queryFn: () => accountDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseAccountListParams {
  pagination: PaginationRequest;
  filters: AccountListFilter;
}

export function useAccountListQuery(params: UseAccountListParams) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => accountDataSource.list(params),
  });
}
