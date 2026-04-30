import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { offerKeys } from '../../../shared/api/queryKeys';
import { offerDataSource } from './offerDataSource';
import type { OfferListFilter } from '../model/types';

export function useOfferQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? offerKeys.detail(id) : offerKeys.detail('none'),
    queryFn: () => offerDataSource.get(id!),
    enabled: !!id,
  });
}

export function useOfferListQuery(params: { pagination: PaginationRequest; filters: OfferListFilter }) {
  return useQuery({ queryKey: offerKeys.list(params), queryFn: () => offerDataSource.list(params) });
}
