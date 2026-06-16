import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { PagedResult } from '@platform/ui';
import { dashboardKeys } from '../../../shared/api/queryKeys';
import { dashboardDataSource } from './dashboardDataSource';

/** Liste widget'larının sayfa boyutu — ilk 3 kayıt, "daha fazla göster" 3'er ekler. */
export const WIDGET_PAGE_SIZE = 3;

// ── Tekil değer / aggregate widget'lar ──────────────────────────────────────

export function useOpenOpportunitiesKpi(ownerOnly: boolean) {
  return useQuery({
    queryKey: dashboardKeys.widget('openOpportunitiesKpi', { ownerOnly }),
    queryFn: () => dashboardDataSource.openOpportunitiesKpi(ownerOnly),
  });
}

export function useWonThisMonthKpi(ownerOnly: boolean) {
  return useQuery({
    queryKey: dashboardKeys.widget('wonThisMonthKpi', { ownerOnly }),
    queryFn: () => dashboardDataSource.wonThisMonthKpi(ownerOnly),
  });
}

export function useNewLeadsKpi(ownerOnly: boolean) {
  return useQuery({
    queryKey: dashboardKeys.widget('newLeadsKpi', { ownerOnly }),
    queryFn: () => dashboardDataSource.newLeadsKpi(ownerOnly),
  });
}

export function useConversionRateKpi(ownerOnly: boolean) {
  return useQuery({
    queryKey: dashboardKeys.widget('conversionRateKpi', { ownerOnly }),
    queryFn: () => dashboardDataSource.conversionRateKpi(ownerOnly),
  });
}

export function usePipelineWidget(ownerOnly: boolean) {
  return useQuery({
    queryKey: dashboardKeys.widget('pipeline', { ownerOnly }),
    queryFn: () => dashboardDataSource.pipeline(ownerOnly),
  });
}

export function useWonLostWidget(ownerOnly: boolean) {
  return useQuery({
    queryKey: dashboardKeys.widget('wonLost', { ownerOnly }),
    queryFn: () => dashboardDataSource.wonLost(ownerOnly),
  });
}

// ── Sayfalı liste widget'ları ("daha fazla göster" = fetchNextPage) ──────────

function getNextPageParam<T>(lastPage: PagedResult<T>, allPages: PagedResult<T>[]) {
  return lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined;
}

export function useClosingOpportunitiesWidget(ownerOnly: boolean) {
  return useInfiniteQuery({
    queryKey: dashboardKeys.widget('closingOpportunities', { ownerOnly }),
    queryFn: ({ pageParam }) =>
      dashboardDataSource.closingOpportunities({
        pagination: { pageNumber: pageParam, pageSize: WIDGET_PAGE_SIZE },
        ownerOnly,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
}

export function useLeadsToAttentionWidget(ownerOnly: boolean) {
  return useInfiniteQuery({
    queryKey: dashboardKeys.widget('leadsToAttention', { ownerOnly }),
    queryFn: ({ pageParam }) =>
      dashboardDataSource.leadsToAttention({
        pagination: { pageNumber: pageParam, pageSize: WIDGET_PAGE_SIZE },
        ownerOnly,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
}

export function useTopAccountsWidget(ownerOnly: boolean) {
  return useInfiniteQuery({
    queryKey: dashboardKeys.widget('topAccounts', { ownerOnly }),
    queryFn: ({ pageParam }) =>
      dashboardDataSource.topAccounts({
        pagination: { pageNumber: pageParam, pageSize: WIDGET_PAGE_SIZE },
        ownerOnly,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
}

export function useRecentRecordsWidget(ownerOnly: boolean) {
  return useInfiniteQuery({
    queryKey: dashboardKeys.widget('recentRecords', { ownerOnly }),
    queryFn: ({ pageParam }) =>
      dashboardDataSource.recentRecords({
        pagination: { pageNumber: pageParam, pageSize: WIDGET_PAGE_SIZE },
        ownerOnly,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
}

// ── Owner-switch'li Activity widget'ları ─────────────────────────────────────

export function useMyTasksWidget(ownerOnly: boolean) {
  return useInfiniteQuery({
    queryKey: dashboardKeys.widget('myTasks', { ownerOnly }),
    queryFn: ({ pageParam }) =>
      dashboardDataSource.myTasks({
        pagination: { pageNumber: pageParam, pageSize: WIDGET_PAGE_SIZE },
        ownerOnly,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
}

export function useRecentActivitiesWidget(ownerOnly: boolean) {
  return useInfiniteQuery({
    queryKey: dashboardKeys.widget('recentActivities', { ownerOnly }),
    queryFn: ({ pageParam }) =>
      dashboardDataSource.recentActivities({
        pagination: { pageNumber: pageParam, pageSize: WIDGET_PAGE_SIZE },
        ownerOnly,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
}
