import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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

export function useOfferListQuery(params: { filters: OfferListFilter; pageSize?: number }) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: offerKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      offerDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
