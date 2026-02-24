import type {
  DashboardLeadStats,
  DashboardAccountStats,
  DashboardOpportunityStats,
  DashboardRevenueStats,
} from '@/types/dashboard.types';
import type { LeadListItem } from '@/types/lead.types';
import type { ActivityListItem } from '@/types/activity.types';
import { ActivityStatus, type ActivityListResponse } from '@/types/activity.types';
import type { LeadListResponse } from '@/types/lead.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/config/service.paths';

export const dashboardService = {

  getLeadStats: async (): Promise<DashboardLeadStats> => {
    const response = await apiClient.get<DashboardLeadStats>(
      ServicePath.Dashboard.LeadStats
    );
    return response.data;
  },

  getAccountStats: async (): Promise<DashboardAccountStats> => {
    const response = await apiClient.get<DashboardAccountStats>(
      ServicePath.Dashboard.AccountStats
    );
    return response.data;
  },

  getOpportunityStats: async (): Promise<DashboardOpportunityStats> => {
    const response = await apiClient.get<DashboardOpportunityStats>(
      ServicePath.Dashboard.OpportunityStats
    );
    return response.data;
  },

  getRevenueStats: async (): Promise<DashboardRevenueStats> => {
    const response = await apiClient.get<DashboardRevenueStats>(
      ServicePath.Dashboard.RevenueStats
    );
    return response.data;
  },

  // ── Liste panelleri ──────────────────────────────────────────────────────────

  getRecentLeads: async (limit = 5): Promise<LeadListItem[]> => {
    const response = await apiClient.post<LeadListResponse>(ServicePath.Lead.List, {
      page: 1,
      pageSize: limit,
    });
    return response.data.data;
  },

  getUpcomingActivities: async (limit = 5): Promise<ActivityListItem[]> => {
    const [notStarted, inProgress] = await Promise.all([
      apiClient.post<ActivityListResponse>(ServicePath.Activity.List, {
        page: 1,
        pageSize: limit,
        filters: { status: ActivityStatus.NotStarted },
      }),
      apiClient.post<ActivityListResponse>(ServicePath.Activity.List, {
        page: 1,
        pageSize: limit,
        filters: { status: ActivityStatus.InProgress },
      }),
    ]);

    return [...notStarted.data.data, ...inProgress.data.data]
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, limit);
  },
};

export default dashboardService;