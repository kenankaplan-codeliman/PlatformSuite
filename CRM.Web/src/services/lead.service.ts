import type {
  LeadDetailItem,
  LeadListRequest,
  LeadListFilters,
  LeadListResponse,
  LeadStatusValue,
} from '@/types/lead.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/config/service.paths';
import type { AssignRequest, IdListRequest, IdRequest, StatusRequest } from '@/types/common.types';

export const leadService = {

  getLeads: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: LeadListFilters
  ): Promise<LeadListResponse> => {
    const request: LeadListRequest = { page, pageSize, filters };
    const response = await apiClient.post<LeadListResponse>(
      ServicePath.Lead.List,
      request
    );
    return response.data;
  },

  getLeadById: async (id: string): Promise<LeadDetailItem> => {
    const request: IdRequest = { id };
    const response = await apiClient.post<LeadDetailItem>(
      ServicePath.Lead.Get,
      request
    );
    return response.data;
  },

  createLead: async (
    lead: Omit<Partial<LeadDetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<LeadDetailItem> => {
    const response = await apiClient.post<LeadDetailItem>(
      ServicePath.Lead.Create,
      lead
    );
    return response.data;
  },

  updateLead: async (lead: Partial<LeadDetailItem>): Promise<LeadDetailItem> => {
    const response = await apiClient.post<LeadDetailItem>(
      ServicePath.Lead.Update,
      lead
    );
    return response.data;
  },

  // Tekil ve bulk silme aynı endpoint — ids dizisiyle çalışır
  deleteLead: async (request: IdListRequest): Promise<void> => {
    await apiClient.post(ServicePath.Lead.Delete, request);
  },

  setStatusLead: async (request: StatusRequest): Promise<void> => {
    await apiClient.post(ServicePath.Lead.State, request);
  },

  // Lead'e özgü: durum güncelleme (New, Contacted, Qualified vb.)
  updateLeadStatus: async (ids: string[], status: LeadStatusValue): Promise<void> => {
    await apiClient.post(ServicePath.Lead.UpdateStatus, { ids, status });
  },

  assignLead: async (request: AssignRequest): Promise<void> => {
    await apiClient.post(ServicePath.Lead.Assign, request);
  }

};

export default leadService;