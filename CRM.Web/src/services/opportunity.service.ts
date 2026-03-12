import type {
  OpportunityDetailItem,
  OpportunityListRequest,
  OpportunityListFilters,
  OpportunityListResponse,
} from '@/types/opportunity.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/config/service.paths';
import type { AssignRequest, IdListRequest, IdRequest, StatusRequest } from '@/types/common.types';

export const opportunityService = {

  getOpportunities: async (
    page: number = 1,
    pageSize: number = 50,
    filters?: OpportunityListFilters
  ): Promise<OpportunityListResponse> => {
    const request: OpportunityListRequest = { page, pageSize, filters };
    const response = await apiClient.post<OpportunityListResponse>(
      ServicePath.Opportunity.List,
      request
    );
    return response.data;
  },

  getOpportunityById: async (id: string): Promise<OpportunityDetailItem> => {
    const request: IdRequest = { id };
    const response = await apiClient.post<OpportunityDetailItem>(
      ServicePath.Opportunity.Get,
      request
    );
    return response.data;
  },

  createOpportunity: async (
    opportunity: Omit<Partial<OpportunityDetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<OpportunityDetailItem> => {
    const response = await apiClient.post<OpportunityDetailItem>(
      ServicePath.Opportunity.Create,
      opportunity
    );
    return response.data;
  },

  updateOpportunity: async (
    opportunity: Partial<OpportunityDetailItem>
  ): Promise<OpportunityDetailItem> => {
    const response = await apiClient.post<OpportunityDetailItem>(
      ServicePath.Opportunity.Update,
      opportunity
    );
    return response.data;
  },

  deleteOpportunity: async (request: IdListRequest): Promise<void> => {
    await apiClient.post(ServicePath.Opportunity.Delete, request);
  },

  setStatusOpportunity: async (request: StatusRequest): Promise<void> => {
    await apiClient.post(ServicePath.Opportunity.State, request);
  },

  assignOpportunity: async (request: AssignRequest): Promise<void> => {
    await apiClient.post(ServicePath.Opportunity.Assign, request);
  },
};

export default opportunityService;