import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { opportunityKeys } from '../../../shared/api/queryKeys';
import { opportunityDataSource } from './opportunityDataSource';
import type { OpportunityListFilter } from '../model/types';

export function useOpportunityQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? opportunityKeys.detail(id) : opportunityKeys.detail('none'),
    queryFn: () => opportunityDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseOpportunityListParams {
  filters: OpportunityListFilter;
  pageSize?: number;
}

export function useOpportunityListQuery(params: UseOpportunityListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: opportunityKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      opportunityDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
