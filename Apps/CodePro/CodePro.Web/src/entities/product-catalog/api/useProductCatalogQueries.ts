import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productCatalogKeys } from '../../../shared/api/queryKeys';
import { productCatalogDataSource } from './productCatalogDataSource';
import type { ProductCatalogListFilter } from '../model/types';

export function useProductCatalogQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? productCatalogKeys.detail(id) : productCatalogKeys.detail('none'),
    queryFn: () => productCatalogDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseProductCatalogListParams {
  filters: ProductCatalogListFilter;
  pageSize?: number;
}

export function useProductCatalogListQuery(params: UseProductCatalogListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: productCatalogKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      productCatalogDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
