import { httpClient } from '@platform/ui';
import { ServicePath } from '@platform/ui';
import type { EntityReference } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import type {
  ContactDetailItem,
  ContactFormValues,
  ContactListFilter,
  ContactListItem,
} from '../model/types';

/**
 * Backend Contact controller endpoint'leri — `/api/contact/*`.
 * Pagination shape nested (PaginationRequest / PaginationResponse).
 */
interface ContactListBody {
  pagination: PaginationRequest;
  filters: ContactListFilter;
}

interface SearchBody {
  searchText?: string;
  pagination: PaginationRequest;
}

interface IdBody {
  id: string;
}

interface IdListBody {
  ids: string[];
}

export const contactDataSource = {
  list: async (body: ContactListBody): Promise<PagedResult<ContactListItem>> => {
    const response = await httpClient.post<PagedResult<ContactListItem>>(
      ServicePath.Contact.List,
      body,
    );
    return response.data;
  },

  search: async (body: SearchBody): Promise<PagedResult<EntityReference>> => {
    const response = await httpClient.post<PagedResult<EntityReference>>(
      ServicePath.Contact.Search,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<ContactDetailItem> => {
    const response = await httpClient.post<ContactDetailItem>(
      ServicePath.Contact.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: ContactFormValues): Promise<ContactDetailItem> => {
    const response = await httpClient.post<ContactDetailItem>(
      ServicePath.Contact.Create,
      values,
    );
    return response.data;
  },

  update: async (values: ContactFormValues): Promise<ContactDetailItem> => {
    const response = await httpClient.post<ContactDetailItem>(
      ServicePath.Contact.Update,
      values,
    );
    return response.data;
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await httpClient.post(ServicePath.Contact.Delete, { ids } satisfies IdListBody);
  },

  setState: async (ids: string[], isActive: boolean): Promise<void> => {
    await httpClient.post(ServicePath.Contact.SetState, { ids, isActive });
  },
};
