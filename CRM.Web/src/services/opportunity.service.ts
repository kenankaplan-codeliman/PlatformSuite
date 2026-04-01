import type {
  OpportunityDetailItem,
  OpportunityListRequest,
  OpportunityListFilters,
  OpportunityListResponse,
  OpportunityStageValue,
} from '@/types/opportunity.types';
import apiClient from '@/services/api.client';
import { apiRequest } from '@/services/api.request';
import { ServicePath } from '@/config/service.paths';
import type { AssignRequest, IdListRequest, IdRequest, StatusRequest } from '@/types/common.types';

export const opportunityService = {

  getOpportunities: async (page = 1, pageSize = 50, filters?: OpportunityListFilters): Promise<OpportunityListResponse> => {
    const request: OpportunityListRequest = { page, pageSize, filters };
    return apiRequest(() => apiClient.post<OpportunityListResponse>(ServicePath.Opportunity.List, request).then(r => r.data));
  },

  getOpportunityById: async (id: string): Promise<OpportunityDetailItem> => {
    const request: IdRequest = { id };
    return apiRequest(() => apiClient.post<OpportunityDetailItem>(ServicePath.Opportunity.Get, request).then(r => r.data));
  },

  createOpportunity: async (opportunity: Omit<Partial<OpportunityDetailItem>, 'id' | 'createdAt' | 'updatedAt'>): Promise<OpportunityDetailItem> => {
    return apiRequest(() => apiClient.post<OpportunityDetailItem>(ServicePath.Opportunity.Create, opportunity).then(r => r.data));
  },

  updateOpportunity: async (opportunity: Partial<OpportunityDetailItem>): Promise<OpportunityDetailItem> => {
    return apiRequest(() => apiClient.post<OpportunityDetailItem>(ServicePath.Opportunity.Update, opportunity).then(r => r.data));
  },

  deleteOpportunity: async (request: IdListRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Opportunity.Delete, request).then(() => undefined));
  },

  setStatusOpportunity: async (request: StatusRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Opportunity.State, request).then(() => undefined));
  },

  assignOpportunity: async (request: AssignRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Opportunity.Assign, request).then(() => undefined));
  },

  updateOpportunityStage: async (ids: string[], stage: OpportunityStageValue): Promise<void> => {
    return apiRequest(() =>
      apiClient.post(ServicePath.Opportunity.BulkUpdateStage, { ids, stage }).then(() => undefined)
    );
  },
};

export default opportunityService;
