// =====================================================
// TYPES
// =====================================================

/**
 * Entity referansı - Lookup component'inde seçilen kayıtlar için
 * Tüm activity'lerde regarding, organizer, attendees vb. için kullanılır
 */

export const EntityType = {
  User: 'user',
  Lead: 'lead',
  Account: 'account',
  Contact: 'contact',
  Product: 'product',
  Opportunity: 'opportunity',
  OpportunityProduct: 'opportunityProduct',

  Email: 'email',
  PhoneCall: 'phoneCall',
  Task: 'task',
  Appointment: 'appointment',
} as const;

export type EntityTypeValue = (typeof EntityType)[keyof typeof EntityType];

export interface EntityReference {
  id: string;
  name: string;
  entityType: EntityTypeValue;
  email?: string;
  phone?: string;
}



// Arama sonucu response
export interface EntitySearchResponse {
  data: EntityReference[];
  hasMore: boolean;
}

// Arama fonksiyonu tipi
export type EntitySearchFunction = (
  entityType: EntityTypeValue,
  searchText: string,
  page: number,
  pageSize: number
) => Promise<EntitySearchResponse>;




