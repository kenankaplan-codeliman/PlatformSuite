import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
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
  pagination: PaginationRequest;
  filters: ProductListFilter;
}

export function useProductListQuery(params: UseProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productDataSource.list(params),
  });
}
