import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { appRoleKeys } from '../../../shared/api/queryKeys';
import { appRoleDataSource } from './appRoleDataSource';
import type { AppRoleListFilter } from '../model/types';

export function useAppRoleQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? appRoleKeys.detail(id) : appRoleKeys.detail('none'),
    queryFn: () => appRoleDataSource.get(id!),
    enabled: !!id,
  });
}

/**
 * Sistemde tanımlı tüm privilege code'larının entity bazında kataloğu.
 * Nadiren değişir (kod sabitlerinden gelir) → uzun staleTime.
 */
export function usePrivilegeCatalogQuery() {
  return useQuery({
    queryKey: appRoleKeys.privilegeCatalog(),
    queryFn: () => appRoleDataSource.privilegeCatalog(),
    staleTime: 5 * 60 * 1000,
  });
}

export interface UseAppRoleListParams {
  filters: AppRoleListFilter;
  pageSize?: number;
}

export function useAppRoleListQuery(params: UseAppRoleListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: appRoleKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      appRoleDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
