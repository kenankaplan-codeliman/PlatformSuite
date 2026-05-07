import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { purchaseBasketKeys } from '../../../shared/api/queryKeys';
import { purchaseBasketDataSource } from './purchaseBasketDataSource';
import type { PurchaseBasketListFilter } from '../model/types';

export function usePurchaseBasketQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? purchaseBasketKeys.detail(id) : purchaseBasketKeys.detail('none'),
    queryFn: () => purchaseBasketDataSource.get(id!),
    enabled: !!id,
  });
}

export function usePurchaseBasketListQuery(params: { filters: PurchaseBasketListFilter; pageSize?: number }) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: purchaseBasketKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      purchaseBasketDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
