import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { contactDataSource } from './contactDataSource';
import { contactKeys } from '../../../shared/api/queryKeys';
import type { ContactListFilter } from '../model/types';

export function useContactQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? contactKeys.detail(id) : contactKeys.detail('none'),
    queryFn: () => contactDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseContactListParams {
  filters: ContactListFilter;
  pageSize?: number;
}

/**
 * Liste sayfası için infinite query — `ListPageLayout` scroll-bottom'da
 * `fetchNextPage` çağırır. `pageParam` 1'den başlar; backend
 * `pagination.hasMoreRecord = false` döndürünce zincir kapanır.
 */
export function useContactListQuery(params: UseContactListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: contactKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      contactDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
