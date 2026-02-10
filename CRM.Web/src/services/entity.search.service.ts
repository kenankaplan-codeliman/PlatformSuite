import apiClient from '@/services/api.client';
import { ServicePath } from '@/constants/service.paths';
import type { EntityReference, EntitySearchResponse, EntityTypeValue } from '@/types/entity.lookup.types';
import { EntityType } from '@/types/entity.lookup.types';

// ============================================
// ENTITY SEARCH SERVICE
// ============================================

export const entitySearchService = {
  /**
   * Belirtilen entity tipinde arama yapar
   */
  search: async (
    entityType: EntityTypeValue,
    searchText: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<EntitySearchResponse> => {
    const request = {
      entityType,
      searchText,
      page,
      pageSize,
    };

    // Entity tipine göre farklı endpoint'ler kullanılabilir
    const endpointMap: Record<EntityTypeValue, string> = {
      [EntityType.User]: ServicePath.User.Search,
      [EntityType.Lead]: ServicePath.Lead.Search,
      [EntityType.Account]: '',//ServicePath.Account.Search,
      [EntityType.Contact]: '',//ServicePath.Contact.Search,
      [EntityType.Opportunity]: '', //ServicePath.Opportunity.Search,
    };

    const endpoint = endpointMap[entityType];

    try {
      const response = await apiClient.post<EntitySearchResponse>(endpoint, request);
      return response.data;
    } catch (error) {
      console.error(`Entity search error for ${entityType}:`, error);
      throw error;
    }
  },

};

export default entitySearchService;
