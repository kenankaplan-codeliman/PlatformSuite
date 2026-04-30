import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
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
  pagination: PaginationRequest;
  filters: ProductCategoryListFilter;
}

export function useProductCategoryListQuery(params: UseProductCategoryListParams) {
  return useQuery({
    queryKey: productCategoryKeys.list(params),
    queryFn: () => productCategoryDataSource.list(params),
  });
}
