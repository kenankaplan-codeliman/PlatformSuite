import type {
  ContactDetailItem,
  ContactListRequest,
  ContactListFilters,
  ContactListResponse,
} from '@/types/contact.types';
import apiClient from '@/services/api.client';
import { apiRequest } from '@/services/api.request';
import { ServicePath } from '@/config/service.paths';
import type { IdRequest, IdListRequest, StatusRequest, AssignRequest } from '@/types/common.types';

export const contactService = {

  getContacts: async (page = 1, pageSize = 10, filters?: ContactListFilters): Promise<ContactListResponse> => {
    const request: ContactListRequest = { page, pageSize, filters };
    return apiRequest(() => apiClient.post<ContactListResponse>(ServicePath.Contact.List, request).then(r => r.data));
  },

  getContactById: async (id: string): Promise<ContactDetailItem> => {
    const request: IdRequest = { id };
    return apiRequest(() => apiClient.post<ContactDetailItem>(ServicePath.Contact.Get, request).then(r => r.data));
  },

  createContact: async (contact: Omit<Partial<ContactDetailItem>, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactDetailItem> => {
    return apiRequest(() => apiClient.post<ContactDetailItem>(ServicePath.Contact.Create, contact).then(r => r.data));
  },

  updateContact: async (contact: Partial<ContactDetailItem>): Promise<ContactDetailItem> => {
    return apiRequest(() => apiClient.post<ContactDetailItem>(ServicePath.Contact.Update, contact).then(r => r.data));
  },

  deleteContact: async (request: IdListRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Contact.Delete, request).then(() => undefined));
  },

  setStatusContact: async (request: StatusRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Contact.State, request).then(() => undefined));
  },

  assignContact: async (request: AssignRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Contact.Assign, request).then(() => undefined));
  },
};

export default contactService;
