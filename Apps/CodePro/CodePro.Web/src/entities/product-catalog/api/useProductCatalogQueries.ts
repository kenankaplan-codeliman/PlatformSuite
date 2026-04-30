import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
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
  pagination: PaginationRequest;
  filters: ProductCatalogListFilter;
}

export function useProductCatalogListQuery(params: UseProductCatalogListParams) {
  return useQuery({
    queryKey: productCatalogKeys.list(params),
    queryFn: () => productCatalogDataSource.list(params),
  });
}
