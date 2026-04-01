import apiClient from '@/services/api.client';
import { apiRequest } from '@/services/api.request';
import { ServicePath } from '@/config/service.paths';
import type { EntitySearchResponse, EntityTypeValue } from '@/types/entity.lookup.types';
import { EntityType } from '@/types/entity.lookup.types';

// Arama desteklemeyen tipler kasıtlı olarak eksik bırakıldı (Partial).
// Bunları eklediğinizde TypeScript otomatik olarak zorunlu kılar.
const endpointMap: Partial<Record<EntityTypeValue, string>> = {
  [EntityType.User]: ServicePath.User.Search,
  [EntityType.Lead]: ServicePath.Lead.Search,
  [EntityType.Account]: ServicePath.Account.Search,
  [EntityType.Contact]: ServicePath.Contact.Search,
  [EntityType.Product]: ServicePath.Product.Search,
  // Opportunity, Email, PhoneCall, Task, Appointment — arama endpoint'i yok
};

export const entitySearchService = {

  search: async (
    entityType: EntityTypeValue,
    searchText: string,
    page = 1,
    pageSize = 10
  ): Promise<EntitySearchResponse> => {
    const endpoint = endpointMap[entityType];

    if (!endpoint) {
      console.warn(`EntitySearchService: "${entityType}" tipi için arama desteklenmiyor.`);
      return { data: [], hasMore: false };
    }

    const request = { entityType, searchText, page, pageSize };
    return apiRequest(() => apiClient.post<EntitySearchResponse>(endpoint, request).then(r => r.data));
  },

};

export default entitySearchService;
