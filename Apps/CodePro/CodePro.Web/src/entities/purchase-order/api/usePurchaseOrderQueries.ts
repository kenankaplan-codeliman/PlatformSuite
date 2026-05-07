import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { purchaseOrderKeys } from '../../../shared/api/queryKeys';
import { purchaseOrderDataSource } from './purchaseOrderDataSource';
import type { PurchaseOrderListFilter } from '../model/types';

export function usePurchaseOrderQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? purchaseOrderKeys.detail(id) : purchaseOrderKeys.detail('none'),
    queryFn: () => purchaseOrderDataSource.get(id!),
    enabled: !!id,
  });
}

export function usePurchaseOrderListQuery(params: { filters: PurchaseOrderListFilter; pageSize?: number }) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: purchaseOrderKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      purchaseOrderDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
