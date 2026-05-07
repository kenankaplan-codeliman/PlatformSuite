import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productPriceKeys } from '../../../shared/api/queryKeys';
import { productPriceDataSource } from './productPriceDataSource';
import type { ProductPriceListFilter } from '../model/types';

export function useProductPriceQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? productPriceKeys.detail(id) : productPriceKeys.detail('none'),
    queryFn: () => productPriceDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseProductPriceListParams {
  filters: ProductPriceListFilter;
  pageSize?: number;
}

export function useProductPriceListQuery(params: UseProductPriceListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: productPriceKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      productPriceDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
