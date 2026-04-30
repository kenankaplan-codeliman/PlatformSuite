import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { purchaseRequestKeys } from '../../../shared/api/queryKeys';
import { purchaseRequestDataSource } from './purchaseRequestDataSource';
import type { PurchaseRequestListFilter } from '../model/types';

export function usePurchaseRequestQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? purchaseRequestKeys.detail(id) : purchaseRequestKeys.detail('none'),
    queryFn: () => purchaseRequestDataSource.get(id!),
    enabled: !!id,
  });
}

export function usePurchaseRequestListQuery(params: { pagination: PaginationRequest; filters: PurchaseRequestListFilter }) {
  return useQuery({
    queryKey: purchaseRequestKeys.list(params),
    queryFn: () => purchaseRequestDataSource.list(params),
  });
}
