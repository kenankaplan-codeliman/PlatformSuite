import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { supplierKeys } from '../../../shared/api/queryKeys';
import { supplierDataSource } from './supplierDataSource';
import type { SupplierListFilter } from '../model/types';

export function useSupplierQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? supplierKeys.detail(id) : supplierKeys.detail('none'),
    queryFn: () => supplierDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseSupplierListParams {
  filters: SupplierListFilter;
  pageSize?: number;
}

export function useSupplierListQuery(params: UseSupplierListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: supplierKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      supplierDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
