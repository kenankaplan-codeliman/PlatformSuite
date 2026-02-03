// =====================================================
// TYPES
// =====================================================

/**
 * Entity referansı - Lookup component'inde seçilen kayıtlar için
 * Tüm activity'lerde regarding, organizer, attendees vb. için kullanılır
 */
export interface EntityReference {
  id: string;
  name: string;
  company?: string;
  entityType: 'User' | 'Account' | 'Contact' | 'Lead' | 'Opportunity';
  email?: string;
  phone?: string;
}

// Desteklenen entity tipleri
export type EntityType = EntityReference['entityType'];

// Arama sonucu response
export interface EntitySearchResponse {
  data: EntityReference[];
  hasMore: boolean;
}

// Arama fonksiyonu tipi
export type EntitySearchFunction = (
  entityType: EntityType,
  searchText: string,
  page: number,
  pageSize: number
) => Promise<EntitySearchResponse>;




