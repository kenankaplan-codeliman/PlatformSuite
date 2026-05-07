import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { accountDataSource } from './accountDataSource';
import { accountKeys } from '../../../shared/api/queryKeys';
import type { AccountListFilter } from '../model/types';

export function useAccountQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? accountKeys.detail(id) : accountKeys.detail('none'),
    queryFn: () => accountDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseAccountListParams {
  filters: AccountListFilter;
  pageSize?: number;
}

/**
 * Liste sayfası için infinite query — `ListPageLayout` scroll-bottom'da
 * `fetchNextPage` çağırır. `pageParam` 1'den başlar; backend
 * `pagination.hasMoreRecord = false` döndürünce zincir kapanır.
 */
export function useAccountListQuery(params: UseAccountListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: accountKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      accountDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
