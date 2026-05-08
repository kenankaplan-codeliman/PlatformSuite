import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { activityDataSource } from './activityDataSource';
import { activityKeys } from '../../../shared/api/queryKeys';
import type {
  ActivityDetailItem,
  ActivityListFilter,
  ActivityType,
} from '../model/types';

export interface UseActivityListParams {
  filters: ActivityListFilter;
  pageSize?: number;
}

export function useActivityListQuery(params: UseActivityListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: activityKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      activityDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}

/**
 * Tek bir activity'yi türüne göre çeker. Türü URL'den (`/activities/:type/:id`)
 * geldiği için query handler'lar değil; URL `:type` segmentinden seçilir.
 */
export function useActivityQuery(type: ActivityType | undefined, id: string | undefined) {
  return useQuery<ActivityDetailItem>({
    queryKey:
      type && id ? activityKeys.detail(type, id) : activityKeys.detail('none', 'none'),
    queryFn: async (): Promise<ActivityDetailItem> => {
      if (!id || !type) throw new Error('useActivityQuery: id/type missing');
      switch (type) {
        case 'PhoneCall':
          return activityDataSource.getPhoneCall(id);
        case 'Task':
          return activityDataSource.getTask(id);
        case 'Appointment':
          return activityDataSource.getAppointment(id);
        case 'Email':
          return activityDataSource.getEmail(id);
      }
    },
    enabled: !!id && !!type,
  });
}
