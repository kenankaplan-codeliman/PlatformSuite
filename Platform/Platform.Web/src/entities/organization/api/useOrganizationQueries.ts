import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { organizationKeys } from '../../../shared/api/queryKeys';
import { organizationDataSource } from './organizationDataSource';
import type { AppOrganizationListFilter } from '../model/types';

export function useOrganizationQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? organizationKeys.detail(id) : organizationKeys.detail('none'),
    queryFn: () => organizationDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseOrganizationListParams {
  filters: AppOrganizationListFilter;
  pageSize?: number;
}

export function useOrganizationListQuery(params: UseOrganizationListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: organizationKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      organizationDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
