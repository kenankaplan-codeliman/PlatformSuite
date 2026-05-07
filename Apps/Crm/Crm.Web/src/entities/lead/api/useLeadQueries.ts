import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { leadKeys } from '../../../shared/api/queryKeys';
import { leadDataSource } from './leadDataSource';
import type { LeadListFilter } from '../model/types';

export function useLeadQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? leadKeys.detail(id) : leadKeys.detail('none'),
    queryFn: () => leadDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseLeadListParams {
  filters: LeadListFilter;
  pageSize?: number;
}

export function useLeadListQuery(params: UseLeadListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: leadKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      leadDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
