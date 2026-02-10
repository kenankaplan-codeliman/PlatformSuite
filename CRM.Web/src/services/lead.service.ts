import type { LeadDetailItem, LeadListRequest,LeadListFilters, LeadListResponse, LeadStatusValue, LeadGetRequest, LeadUpdateRequest, LeadDeleteRequest, LeadBulkDeleteRequest, LeadBulkUpdateStatusRequest } from '@/types/lead.types';
import apiClient from "@/services/api.client";
import { ServicePath } from '@/constants/service.paths';


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
      ServicePath.Lead.List, 
      request);

    return response.data;
  },

  // Get single lead by ID
  getLeadById: async (id: string): Promise<LeadDetailItem> => {

    const request : LeadGetRequest = {
      id: id,
      };
    
    const response = await apiClient.post<LeadDetailItem>(
      ServicePath.Lead.Get, 
      request);
    return response.data;
  },

  // Create new lead
  createLead: async (lead: Omit<Partial<LeadDetailItem>, 'id' | 'createdAt' | 'createdBy'>): Promise<LeadDetailItem> => {
    const response = await apiClient.post<LeadDetailItem>(
      ServicePath.Lead.Create
      , lead);
    return response.data;
  },

  // Update existing lead
  updateLead: async (id: string, lead: Partial<LeadDetailItem>): Promise<LeadDetailItem> => {

  const request : LeadUpdateRequest = {
      id: id,
      data: lead,
      };

  const response = await apiClient.post<LeadDetailItem>(
      ServicePath.Lead.Update
      , request);

    return response.data;
  },

  // Delete lead (soft delete)
  deleteLead: async (id: string): Promise<void> => {
    const request : LeadDeleteRequest = {
      id: id,
      };

    await apiClient.post(ServicePath.Lead.Delete, request);
  },

  // Bulk delete leads
  bulkDeleteLeads: async (ids: string[]): Promise<void> => {

    const request : LeadBulkDeleteRequest = {
          ids: ids,
          };

    await apiClient.post(ServicePath.Lead.BulkDelete, request);
  },

  // Bulk update lead status
  bulkUpdateStatus: async (ids: string[], status: LeadStatusValue): Promise<void> => {
    const request : LeadBulkUpdateStatusRequest = {
          ids: ids,
          status: status,
          };

    await apiClient.post(ServicePath.Lead.BulkUpdateStatus, request);
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
