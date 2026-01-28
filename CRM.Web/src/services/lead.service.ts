import type { LeadListItem, LeadDetailItem, LeadListRequest,LeadListFilters, LeadListResponse, LeadStatusValue } from '@/types/lead.types';
import apiClient from "@/services/api.client";
import { EndPointPaths } from '@/constants/endpoint.paths';


export const leadService = {
  // Get paginated list of leads with optional filters
  getLeads: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: LeadListFilters
  ): Promise<LeadListResponse> => {
    
    const request : LeadListRequest = {
      page: page,
      pageSize: pageSize,
      filters: filters,
    };

    const response = await apiClient.post<LeadListResponse>(
      EndPointPaths.Lead.List, 
      request);

    return response.data;
  },

  // Get single lead by ID
  getLeadById: async (id: string): Promise<LeadDetailItem> => {
    const response = await apiClient.get<LeadDetailItem>(`/${id}`);
    return response.data;
  },

  // Create new lead
  createLead: async (lead: Omit<LeadDetailItem, 'id' | 'createdAt' | 'createdBy'>): Promise<LeadDetailItem> => {
    const response = await apiClient.post<LeadDetailItem>('', lead);
    return response.data;
  },

  // Update existing lead
  updateLead: async (id: string, lead: Partial<LeadDetailItem>): Promise<LeadDetailItem> => {
    const response = await apiClient.put<LeadDetailItem>(`/${id}`, lead);
    return response.data;
  },

  // Delete lead (soft delete)
  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/${id}`);
  },

  // Bulk delete leads
  bulkDeleteLeads: async (ids: string[]): Promise<void> => {
    await apiClient.post('/bulk-delete', { ids });
  },

  // Bulk update lead status
  bulkUpdateStatus: async (ids: string[], status: LeadStatusValue): Promise<void> => {
    await apiClient.post('/bulk-update-status', { ids, status });
  },

  // Convert lead to account/contact/opportunity
  convertLead: async (id: string): Promise<{
    accountId: string;
    contactId: string;
    opportunityId: string;
  }> => {
    const response = await apiClient.post(`/${id}/convert`);
    return response.data;
  },

  // Export leads to Excel
  exportLeads: async (filters?: LeadListFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default leadService;
