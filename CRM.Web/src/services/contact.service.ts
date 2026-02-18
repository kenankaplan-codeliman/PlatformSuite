import type {
  ContactDetailItem,
  ContactListRequest,
  ContactListFilters,
  ContactListResponse,
} from '@/types/contact.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/config/service.paths';
import type { IdListRequest, IdRequest } from '@/types/common.types';

export const contactService = {
  // Get paginated list of contacts with optional filters
  getContacts: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: ContactListFilters
  ): Promise<ContactListResponse> => {
    const request: ContactListRequest = {
      page,
      pageSize,
      filters,
    };

    const response = await apiClient.post<ContactListResponse>(
      ServicePath.Contact.List,
      request
    );

    return response.data;
  },

  // Get single contact by ID
  getContactById: async (id: string): Promise<ContactDetailItem> => {
    const request: IdRequest = { id };

    const response = await apiClient.post<ContactDetailItem>(
      ServicePath.Contact.Get,
      request
    );

    return response.data;
  },

  // Create new contact
  createContact: async (
    contact: Omit<Partial<ContactDetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ContactDetailItem> => {
    const response = await apiClient.post<ContactDetailItem>(
      ServicePath.Contact.Create,
      contact
    );
    return response.data;
  },

  // Update existing contact
  updateContact: async (
    contact: Partial<ContactDetailItem>
  ): Promise<ContactDetailItem> => {
    const response = await apiClient.post<ContactDetailItem>(
      ServicePath.Contact.Update,
      contact
    );
    return response.data;
  },

  // Delete contact (soft delete)
  deleteContact: async (id: string): Promise<void> => {
    const request: IdRequest = { id };
    await apiClient.post(ServicePath.Contact.Delete, request);
  },

  // Bulk delete contacts
  bulkDeleteContacts: async (ids: string[]): Promise<void> => {
    const request: IdListRequest = { ids };
    await apiClient.post(ServicePath.Contact.BulkDelete, request);
  },

  // Export contacts to Excel
  exportContacts: async (filters?: ContactListFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`/contacts/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default contactService;
