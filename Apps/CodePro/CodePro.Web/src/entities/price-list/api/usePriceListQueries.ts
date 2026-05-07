import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { priceListKeys } from '../../../shared/api/queryKeys';
import { priceListDataSource } from './priceListDataSource';
import type { PriceListListFilter } from '../model/types';

export function usePriceListQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? priceListKeys.detail(id) : priceListKeys.detail('none'),
    queryFn: () => priceListDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UsePriceListListParams {
  filters: PriceListListFilter;
  pageSize?: number;
}

export function usePriceListListQuery(params: UsePriceListListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: priceListKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      priceListDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
