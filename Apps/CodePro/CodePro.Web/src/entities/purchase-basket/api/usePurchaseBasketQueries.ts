import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { purchaseBasketKeys } from '../../../shared/api/queryKeys';
import { purchaseBasketDataSource } from './purchaseBasketDataSource';
import type { PurchaseBasketListFilter } from '../model/types';

export function usePurchaseBasketQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? purchaseBasketKeys.detail(id) : purchaseBasketKeys.detail('none'),
    queryFn: () => purchaseBasketDataSource.get(id!),
    enabled: !!id,
  });
}

export function usePurchaseBasketListQuery(params: { pagination: PaginationRequest; filters: PurchaseBasketListFilter }) {
  return useQuery({ queryKey: purchaseBasketKeys.list(params), queryFn: () => purchaseBasketDataSource.list(params) });
}
