import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { eDocumentKeys } from '../../../shared/api/queryKeys';
import { eDocumentDataSource } from './eDocumentDataSource';
import type { EDocumentListFilter } from '../model/types';

export function useEDocumentQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? eDocumentKeys.detail(id) : eDocumentKeys.detail('none'),
    queryFn: () => eDocumentDataSource.get(id!),
    enabled: !!id,
  });
}

export function useEDocumentListQuery(params: { filters: EDocumentListFilter; pageSize?: number }) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: eDocumentKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      eDocumentDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
