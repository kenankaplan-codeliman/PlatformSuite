import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { purchaseRequestKeys } from '../../../shared/api/queryKeys';
import { purchaseRequestDataSource } from './purchaseRequestDataSource';
import type { PurchaseRequestListFilter } from '../model/types';

export function usePurchaseRequestQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? purchaseRequestKeys.detail(id) : purchaseRequestKeys.detail('none'),
    queryFn: () => purchaseRequestDataSource.get(id!),
    enabled: !!id,
  });
}

export function usePurchaseRequestListQuery(params: { filters: PurchaseRequestListFilter; pageSize?: number }) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: purchaseRequestKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      purchaseRequestDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
