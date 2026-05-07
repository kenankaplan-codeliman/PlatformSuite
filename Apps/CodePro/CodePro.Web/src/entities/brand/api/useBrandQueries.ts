import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { brandKeys } from '../../../shared/api/queryKeys';
import { brandDataSource } from './brandDataSource';
import type { BrandListFilter } from '../model/types';

export function useBrandQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? brandKeys.detail(id) : brandKeys.detail('none'),
    queryFn: () => brandDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseBrandListParams {
  filters: BrandListFilter;
  pageSize?: number;
}

export function useBrandListQuery(params: UseBrandListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: brandKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      brandDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
