import type {
  AccountDetailItem,
  AccountListRequest,
  AccountListFilters,
  AccountListResponse,
} from '@/types/account.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/config/service.paths';
import type { IdRequest, IdListRequest, StatusRequest, AssignRequest } from '@/types/common.types';

export const accountService = {
  
  getAccounts: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: AccountListFilters
  ): Promise<AccountListResponse> => {
    const request: AccountListRequest = {
      page: page,
      pageSize: pageSize,
      filters: filters,
    };

    const response = await apiClient.post<AccountListResponse>(
      ServicePath.Account.List,
      request
    );

    return response.data;
  },

  getAccountById: async (id: string): Promise<AccountDetailItem> => {
    const request: IdRequest = {
      id: id,
    };

    const response = await apiClient.post<AccountDetailItem>(
      ServicePath.Account.Get,
      request
    );

    return response.data;
  },

  createAccount: async (
    account: Omit<Partial<AccountDetailItem>, 'id' | 'createdAt' | 'createdBy'>
  ): Promise<AccountDetailItem> => {
    const response = await apiClient.post<AccountDetailItem>(
      ServicePath.Account.Create,
      account
    );
    return response.data;
  },

  updateAccount: async (
    account: Partial<AccountDetailItem>
  ): Promise<AccountDetailItem> => {

    const response = await apiClient.post<AccountDetailItem>(
      ServicePath.Account.Update,
      account
    );

    return response.data;
  },

  deleteAccount: async (request: IdListRequest): Promise<void> => {
    await apiClient.post(ServicePath.Account.Delete, request);
  },

  setStatusAccount: async (request: StatusRequest): Promise<void> => {
    await apiClient.post(ServicePath.Account.State, request);
  },

  assignAccount: async (request: AssignRequest): Promise<void> => {
    await apiClient.post(ServicePath.Account.Assign, request);
  },

};

export default accountService;
