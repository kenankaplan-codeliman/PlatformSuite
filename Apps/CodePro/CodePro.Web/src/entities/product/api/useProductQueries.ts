import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productKeys } from '../../../shared/api/queryKeys';
import { productDataSource } from './productDataSource';
import type { ProductListFilter } from '../model/types';

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? productKeys.detail(id) : productKeys.detail('none'),
    queryFn: () => productDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseProductListParams {
  filters: ProductListFilter;
  pageSize?: number;
}

export function useProductListQuery(params: UseProductListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: productKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      productDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
