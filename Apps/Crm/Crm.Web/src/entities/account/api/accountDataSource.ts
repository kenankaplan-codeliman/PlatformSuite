import { httpClient } from '@platform/ui';
import { ServicePath } from '@platform/ui';
import type { EntityReference } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import type {
  AccountDetailItem,
  AccountListFilter,
  AccountListItem,
  AccountFormValues,
} from '../model/types';

/**
 * Backend Account controller endpoint'leri — `/api/account/*`.
 * Pagination shape nested (PaginationRequest / PaginationResponse).
 */
interface AccountListBody {
  pagination: PaginationRequest;
  filters: AccountListFilter;
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

export const accountDataSource = {
  list: async (body: AccountListBody): Promise<PagedResult<AccountListItem>> => {
    const response = await httpClient.post<PagedResult<AccountListItem>>(
      ServicePath.Account.List,
      body,
    );
    return response.data;
  },

  search: async (body: SearchBody): Promise<PagedResult<EntityReference>> => {
    const response = await httpClient.post<PagedResult<EntityReference>>(
      ServicePath.Account.Search,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<AccountDetailItem> => {
    const response = await httpClient.post<AccountDetailItem>(
      ServicePath.Account.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: AccountFormValues): Promise<AccountDetailItem> => {
    const response = await httpClient.post<AccountDetailItem>(
      ServicePath.Account.Create,
      values,
    );
    return response.data;
  },

  update: async (values: AccountFormValues): Promise<AccountDetailItem> => {
    const response = await httpClient.post<AccountDetailItem>(
      ServicePath.Account.Update,
      values,
    );
    return response.data;
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await httpClient.post(ServicePath.Account.Delete, { ids } satisfies IdListBody);
  },

  setState: async (ids: string[], isActive: boolean): Promise<void> => {
    await httpClient.post(ServicePath.Account.SetState, { ids, isActive });
  },
};
