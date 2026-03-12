import type {
  ContactDetailItem,
  ContactListRequest,
  ContactListFilters,
  ContactListResponse,
} from '@/types/contact.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/config/service.paths';
import type { IdRequest, IdListRequest, StatusRequest, AssignRequest } from '@/types/common.types';

export const contactService = {

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

  getContactById: async (id: string): Promise<ContactDetailItem> => {
    const request: IdRequest = { id };
    const response = await apiClient.post<ContactDetailItem>(
      ServicePath.Contact.Get,
      request
    );
    return response.data;
  },

  createContact: async (
    contact: Omit<Partial<ContactDetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ContactDetailItem> => {
    const response = await apiClient.post<ContactDetailItem>(
      ServicePath.Contact.Create,
      contact
    );
    return response.data;
  },

  updateContact: async (contact: Partial<ContactDetailItem>): Promise<ContactDetailItem> => {
    const response = await apiClient.post<ContactDetailItem>(
      ServicePath.Contact.Update,
      contact
    );
    return response.data;
  },

  // Tekil ve bulk silme aynı endpoint — ids dizisiyle çalışır
  deleteContact: async (request: IdListRequest): Promise<void> => {
    await apiClient.post(ServicePath.Contact.Delete, request);
  },

  setStatusContact: async (request: StatusRequest): Promise<void> => {
    await apiClient.post(ServicePath.Contact.Status, request);
  },

  assignContact: async (request: AssignRequest): Promise<void> => {
    await apiClient.post(ServicePath.Contact.Assign, request);
  },
};

export default contactService;