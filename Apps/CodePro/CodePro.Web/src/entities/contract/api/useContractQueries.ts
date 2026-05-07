import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { contractKeys } from '../../../shared/api/queryKeys';
import { contractDataSource } from './contractDataSource';
import type { ContractListFilter } from '../model/types';

export function useContractQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? contractKeys.detail(id) : contractKeys.detail('none'),
    queryFn: () => contractDataSource.get(id!),
    enabled: !!id,
  });
}

export function useContractListQuery(params: { filters: ContractListFilter; pageSize?: number }) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: contractKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      contractDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
