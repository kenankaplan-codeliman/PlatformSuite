import type {
  DashboardLeadStats,
  DashboardAccountStats,
  DashboardOpportunityStats,
  DashboardRevenueStats,
} from '@/types/dashboard.types';
import type { LeadListItem } from '@/types/lead.types';
import type { ActivityListItem } from '@/types/activity.types';
import apiClient from '@/services/api.client';
import { apiRequest } from '@/services/api.request';
import { ServicePath } from '@/config/service.paths';

export const dashboardService = {

  getLeadStats: async (): Promise<DashboardLeadStats> =>
    apiRequest(() => apiClient.get<DashboardLeadStats>(ServicePath.Dashboard.LeadStats).then(r => r.data)),

  getAccountStats: async (): Promise<DashboardAccountStats> =>
    apiRequest(() => apiClient.get<DashboardAccountStats>(ServicePath.Dashboard.AccountStats).then(r => r.data)),

  getOpportunityStats: async (): Promise<DashboardOpportunityStats> =>
    apiRequest(() => apiClient.get<DashboardOpportunityStats>(ServicePath.Dashboard.OpportunityStats).then(r => r.data)),

  getRevenueStats: async (): Promise<DashboardRevenueStats> =>
    apiRequest(() => apiClient.get<DashboardRevenueStats>(ServicePath.Dashboard.RevenueStats).then(r => r.data)),

  getRecentLeads: async (): Promise<LeadListItem[]> =>
    apiRequest(() => apiClient.get<LeadListItem[]>(ServicePath.Dashboard.RecentLeads).then(r => r.data)),

  getUpcomingActivities: async (): Promise<ActivityListItem[]> =>
    apiRequest(() => apiClient.get<ActivityListItem[]>(ServicePath.Dashboard.UpcomingActivities).then(r => r.data)),

};

export default dashboardService;