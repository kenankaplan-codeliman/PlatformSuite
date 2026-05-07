import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { appUserKeys } from '../../../shared/api/queryKeys';
import { appUserDataSource } from './appUserDataSource';
import type { AppUserListFilter } from '../model/types';

export function useAppUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? appUserKeys.detail(id) : appUserKeys.detail('none'),
    queryFn: () => appUserDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseAppUserListParams {
  filters: AppUserListFilter;
  pageSize?: number;
}

export function useAppUserListQuery(params: UseAppUserListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: appUserKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      appUserDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
