import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { priceListKeys } from '../../../shared/api/queryKeys';
import { priceListDataSource } from './priceListDataSource';
import type { PriceListListFilter } from '../model/types';

export function usePriceListQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? priceListKeys.detail(id) : priceListKeys.detail('none'),
    queryFn: () => priceListDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UsePriceListListParams {
  pagination: PaginationRequest;
  filters: PriceListListFilter;
}

export function usePriceListListQuery(params: UsePriceListListParams) {
  return useQuery({
    queryKey: priceListKeys.list(params),
    queryFn: () => priceListDataSource.list(params),
  });
}
