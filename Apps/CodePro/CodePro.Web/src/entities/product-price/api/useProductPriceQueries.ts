import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
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
  pagination: PaginationRequest;
  filters: ProductPriceListFilter;
}

export function useProductPriceListQuery(params: UseProductPriceListParams) {
  return useQuery({
    queryKey: productPriceKeys.list(params),
    queryFn: () => productPriceDataSource.list(params),
  });
}
