import type {
  OpportunityDetailItem,
  OpportunityListRequest,
  OpportunityListFilters,
  OpportunityListResponse,
} from '@/types/opportunity.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/config/service.paths';
import type { AssignRequest, IdListRequest, IdRequest } from '@/types/common.types';

export const opportunityService = {
  // Fırsat listesini sayfalı olarak getir
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

  assignOpportunity: async (opportunityId: string, userId: string) => {
    const request: AssignRequest = { entityId: opportunityId, ownerId: userId };
    await apiClient.post(ServicePath.Opportunity.Assign, request);
  },

  getOpportunityById: async (id: string): Promise<OpportunityDetailItem> => {
    const request: IdRequest = { id };
    const response = await apiClient.post<OpportunityDetailItem>(
      ServicePath.Opportunity.Get,
      request
    );
    return response.data;
  },

  // Yeni fırsat oluştur
  createOpportunity: async (
    opportunity: Omit<Partial<OpportunityDetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<OpportunityDetailItem> => {
    const response = await apiClient.post<OpportunityDetailItem>(
      ServicePath.Opportunity.Create,
      opportunity
    );
    return response.data;
  },

  // Fırsatı güncelle
  updateOpportunity: async (
    opportunity: Partial<OpportunityDetailItem>
  ): Promise<OpportunityDetailItem> => {
    const response = await apiClient.post<OpportunityDetailItem>(
      ServicePath.Opportunity.Update,
      opportunity
    );
    return response.data;
  },

  // Fırsatı sil (soft delete)
  deleteOpportunity: async (id: string): Promise<void> => {
    const request: IdRequest = { id };
    await apiClient.post(ServicePath.Opportunity.Delete, request);
  },

  // Toplu sil
  bulkDeleteOpportunities: async (ids: string[]): Promise<void> => {
    const request: IdListRequest = { ids };
    await apiClient.post(ServicePath.Opportunity.BulkDelete, request);
  },

};

export default opportunityService;
