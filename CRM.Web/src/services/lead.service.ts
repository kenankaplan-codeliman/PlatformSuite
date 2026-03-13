import type {
  LeadDetailItem,
  LeadListRequest,
  LeadListFilters,
  LeadListResponse,
  LeadStatusValue,
} from '@/types/lead.types';
import apiClient from '@/services/api.client';
import { apiRequest } from '@/services/api.request';
import { ServicePath } from '@/config/service.paths';
import type { AssignRequest, IdListRequest, IdRequest, StatusRequest } from '@/types/common.types';

export const leadService = {

  getLeads: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: LeadListFilters
  ): Promise<LeadListResponse> => {
    const request: LeadListRequest = { page, pageSize, filters };
    return apiRequest(() =>
      apiClient.post<LeadListResponse>(ServicePath.Lead.List, request).then(r => r.data)
    );
  },

  getLeadById: async (id: string): Promise<LeadDetailItem> => {
    const request: IdRequest = { id };
    return apiRequest(() =>
      apiClient.post<LeadDetailItem>(ServicePath.Lead.Get, request).then(r => r.data)
    );
  },

  createLead: async (
    lead: Omit<Partial<LeadDetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<LeadDetailItem> => {
    return apiRequest(() =>
      apiClient.post<LeadDetailItem>(ServicePath.Lead.Create, lead).then(r => r.data)
    );
  },

  updateLead: async (lead: Partial<LeadDetailItem>): Promise<LeadDetailItem> => {
    return apiRequest(() =>
      apiClient.post<LeadDetailItem>(ServicePath.Lead.Update, lead).then(r => r.data)
    );
  },

  deleteLead: async (request: IdListRequest): Promise<void> => {
    return apiRequest(() =>
      apiClient.post(ServicePath.Lead.Delete, request).then(() => undefined)
    );
  },

  setStatusLead: async (request: StatusRequest): Promise<void> => {
    return apiRequest(() =>
      apiClient.post(ServicePath.Lead.State, request).then(() => undefined)
    );
  },

  updateLeadStatus: async (ids: string[], status: LeadStatusValue): Promise<void> => {
    return apiRequest(() =>
      apiClient.post(ServicePath.Lead.UpdateStatus, { ids, status }).then(() => undefined)
    );
  },

  assignLead: async (request: AssignRequest): Promise<void> => {
    return apiRequest(() =>
      apiClient.post(ServicePath.Lead.Assign, request).then(() => undefined)
    );
  },

};

export default leadService;
