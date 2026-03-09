import type {
  DashboardLeadStats,
  DashboardAccountStats,
  DashboardOpportunityStats,
  DashboardRevenueStats,
} from '@/types/dashboard.types';
import type { LeadListItem } from '@/types/lead.types';
import type { ActivityListItem } from '@/types/activity.types';
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

  getRecentLeads: async (): Promise<LeadListItem[]> => {
    const response = await apiClient.get<LeadListItem[]>(
      ServicePath.Dashboard.RecentLeads
    );
    return response.data;

  },

  getUpcomingActivities: async (): Promise<ActivityListItem[]> => {
    
    const response = await apiClient.get<ActivityListItem[]>(
      ServicePath.Dashboard.UpcomingActivities
    );
    return response.data;
  },
};

export default dashboardService;