import apiClient from '@/services/api.client';
import { ServicePath } from '@/constants/service.paths';
import type { EntityReference, EntityType, EntitySearchResponse } from '@/types/entity.lookup.types';

// ============================================
// ENTITY SEARCH SERVICE
// ============================================

export const entitySearchService = {
  /**
   * Belirtilen entity tipinde arama yapar
   */
  search: async (
    entityType: EntityType,
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
    const endpointMap: Record<EntityType, string> = {
      User: ServicePath.User.Search,
      Lead: ServicePath.Lead.Search,
      Account: "",
      Contact: "",
      Opportunity: "",
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

// ============================================
// MOCK SEARCH SERVICE (Development için)
// ============================================

// Mock data
const mockUsers: EntityReference[] = [
  { id: 'u1', name: 'Ahmet Yılmaz', entityType: 'User', email: 'ahmet@company.com', company: 'Company A' },
  { id: 'u2', name: 'Mehmet Demir', entityType: 'User', email: 'mehmet@company.com', company: 'Company A' },
  { id: 'u3', name: 'Ayşe Kaya', entityType: 'User', email: 'ayse@company.com', company: 'Company B' },
  { id: 'u4', name: 'Fatma Öztürk', entityType: 'User', email: 'fatma@company.com', company: 'Company B' },
  { id: 'u5', name: 'Ali Çelik', entityType: 'User', email: 'ali@company.com', company: 'Company C' },
  { id: 'u6', name: 'Zeynep Arslan', entityType: 'User', email: 'zeynep@company.com', company: 'Company C' },
  { id: 'u7', name: 'Mustafa Şahin', entityType: 'User', email: 'mustafa@company.com', company: 'Company D' },
  { id: 'u8', name: 'Elif Koç', entityType: 'User', email: 'elif@company.com', company: 'Company D' },
];

const mockAccounts: EntityReference[] = [
  { id: 'a1', name: 'ABC Teknoloji A.Ş.', entityType: 'Account', email: 'info@abc.com', phone: '+90 212 555 0001' },
  { id: 'a2', name: 'XYZ Holding', entityType: 'Account', email: 'info@xyz.com', phone: '+90 212 555 0002' },
  { id: 'a3', name: 'Mega Yazılım Ltd.', entityType: 'Account', email: 'info@mega.com', phone: '+90 212 555 0003' },
  { id: 'a4', name: 'Global Ticaret A.Ş.', entityType: 'Account', email: 'info@global.com', phone: '+90 212 555 0004' },
  { id: 'a5', name: 'Startup Hub', entityType: 'Account', email: 'info@startup.com', phone: '+90 212 555 0005' },
];

const mockContacts: EntityReference[] = [
  { id: 'c1', name: 'Burak Yıldız', entityType: 'Contact', email: 'burak@abc.com', company: 'ABC Teknoloji A.Ş.' },
  { id: 'c2', name: 'Selin Aktaş', entityType: 'Contact', email: 'selin@xyz.com', company: 'XYZ Holding' },
  { id: 'c3', name: 'Emre Güneş', entityType: 'Contact', email: 'emre@mega.com', company: 'Mega Yazılım Ltd.' },
  { id: 'c4', name: 'Deniz Aydın', entityType: 'Contact', email: 'deniz@global.com', company: 'Global Ticaret A.Ş.' },
  { id: 'c5', name: 'Ceren Polat', entityType: 'Contact', email: 'ceren@startup.com', company: 'Startup Hub' },
];

const mockLeads: EntityReference[] = [
  { id: 'l1', name: 'Yeni Müşteri - Tech Corp', entityType: 'Lead', email: 'lead1@tech.com', company: 'Tech Corp' },
  { id: 'l2', name: 'Potansiyel - Digital Solutions', entityType: 'Lead', email: 'lead2@digital.com', company: 'Digital Solutions' },
  { id: 'l3', name: 'İlgili - Smart Systems', entityType: 'Lead', email: 'lead3@smart.com', company: 'Smart Systems' },
  { id: 'l4', name: 'Aday - Future Tech', entityType: 'Lead', email: 'lead4@future.com', company: 'Future Tech' },
];

const mockOpportunities: EntityReference[] = [
  { id: 'o1', name: 'ERP Projesi - ABC', entityType: 'Opportunity', company: 'ABC Teknoloji A.Ş.' },
  { id: 'o2', name: 'CRM Implementasyonu - XYZ', entityType: 'Opportunity', company: 'XYZ Holding' },
  { id: 'o3', name: 'Mobil Uygulama - Mega', entityType: 'Opportunity', company: 'Mega Yazılım Ltd.' },
];

const mockDataMap: Record<EntityType, EntityReference[]> = {
  User: mockUsers,
  Account: mockAccounts,
  Contact: mockContacts,
  Lead: mockLeads,
  Opportunity: mockOpportunities,
};

/**
 * Mock search fonksiyonu - development ve test için
 */
export const mockEntitySearch = async (
  entityType: EntityType,
  searchText: string,
  page: number = 1,
  pageSize: number = 10
): Promise<EntitySearchResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

  const data = mockDataMap[entityType] || [];
  const searchLower = searchText.toLowerCase();

  // Filter by search text
  const filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower) ||
      item.company?.toLowerCase().includes(searchLower)
  );

  // Paginate
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    hasMore: endIndex < filtered.length,
  };
};

export default entitySearchService;
