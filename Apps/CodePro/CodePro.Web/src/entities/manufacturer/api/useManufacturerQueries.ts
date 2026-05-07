import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { manufacturerKeys } from '../../../shared/api/queryKeys';
import { manufacturerDataSource } from './manufacturerDataSource';
import type { ManufacturerListFilter } from '../model/types';

export function useManufacturerQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? manufacturerKeys.detail(id) : manufacturerKeys.detail('none'),
    queryFn: () => manufacturerDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseManufacturerListParams {
  filters: ManufacturerListFilter;
  pageSize?: number;
}

export function useManufacturerListQuery(params: UseManufacturerListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: manufacturerKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      manufacturerDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
