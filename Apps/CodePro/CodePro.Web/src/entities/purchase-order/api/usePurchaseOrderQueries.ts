import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { purchaseOrderKeys } from '../../../shared/api/queryKeys';
import { purchaseOrderDataSource } from './purchaseOrderDataSource';
import type { PurchaseOrderListFilter } from '../model/types';

export function usePurchaseOrderQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? purchaseOrderKeys.detail(id) : purchaseOrderKeys.detail('none'),
    queryFn: () => purchaseOrderDataSource.get(id!),
    enabled: !!id,
  });
}

export function usePurchaseOrderListQuery(params: { pagination: PaginationRequest; filters: PurchaseOrderListFilter }) {
  return useQuery({ queryKey: purchaseOrderKeys.list(params), queryFn: () => purchaseOrderDataSource.list(params) });
}
