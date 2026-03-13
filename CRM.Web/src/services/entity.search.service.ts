import apiClient from '@/services/api.client';
import { apiRequest } from '@/services/api.request';
import { ServicePath } from '@/config/service.paths';
import type { EntitySearchResponse, EntityTypeValue } from '@/types/entity.lookup.types';
import { EntityType } from '@/types/entity.lookup.types';

const endpointMap: Record<EntityTypeValue, string> = {
  [EntityType.User]: ServicePath.User.Search,
  [EntityType.Lead]: ServicePath.Lead.Search,
  [EntityType.Account]: ServicePath.Account.Search,
  [EntityType.Contact]: ServicePath.Contact.Search,
  [EntityType.Product]: ServicePath.Product.Search,
  [EntityType.Opportunity]: '',
  [EntityType.Email]: '',
  [EntityType.PhoneCall]: '',
  [EntityType.Task]: '',
  [EntityType.Appointment]: '',
};

export const entitySearchService = {

  search: async (
    entityType: EntityTypeValue,
    searchText: string,
    page = 1,
    pageSize = 10
  ): Promise<EntitySearchResponse> => {
    const endpoint = endpointMap[entityType];
    const request = { entityType, searchText, page, pageSize };
    return apiRequest(() => apiClient.post<EntitySearchResponse>(endpoint, request).then(r => r.data));
  },

};

export default entitySearchService;
