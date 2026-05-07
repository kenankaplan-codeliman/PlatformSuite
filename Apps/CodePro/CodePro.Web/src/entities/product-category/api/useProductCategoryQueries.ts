import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productCategoryKeys } from '../../../shared/api/queryKeys';
import { productCategoryDataSource } from './productCategoryDataSource';
import type { ProductCategoryListFilter } from '../model/types';

export function useProductCategoryQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? productCategoryKeys.detail(id) : productCategoryKeys.detail('none'),
    queryFn: () => productCategoryDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseProductCategoryListParams {
  filters: ProductCategoryListFilter;
  pageSize?: number;
}

export function useProductCategoryListQuery(params: UseProductCategoryListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: productCategoryKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      productCategoryDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
