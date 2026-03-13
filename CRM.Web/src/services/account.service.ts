import type {
  AccountDetailItem,
  AccountListRequest,
  AccountListFilters,
  AccountListResponse,
} from '@/types/account.types';
import apiClient from '@/services/api.client';
import { apiRequest } from '@/services/api.request';
import { ServicePath } from '@/config/service.paths';
import type { IdRequest, IdListRequest, StatusRequest, AssignRequest } from '@/types/common.types';

export const accountService = {

  getAccounts: async (page = 1, pageSize = 10, filters?: AccountListFilters): Promise<AccountListResponse> => {
    const request: AccountListRequest = { page, pageSize, filters };
    return apiRequest(() => apiClient.post<AccountListResponse>(ServicePath.Account.List, request).then(r => r.data));
  },

  getAccountById: async (id: string): Promise<AccountDetailItem> => {
    const request: IdRequest = { id };
    return apiRequest(() => apiClient.post<AccountDetailItem>(ServicePath.Account.Get, request).then(r => r.data));
  },

  createAccount: async (account: Omit<Partial<AccountDetailItem>, 'id' | 'createdAt' | 'createdBy'>): Promise<AccountDetailItem> => {
    return apiRequest(() => apiClient.post<AccountDetailItem>(ServicePath.Account.Create, account).then(r => r.data));
  },

  updateAccount: async (account: Partial<AccountDetailItem>): Promise<AccountDetailItem> => {
    return apiRequest(() => apiClient.post<AccountDetailItem>(ServicePath.Account.Update, account).then(r => r.data));
  },

  deleteAccount: async (request: IdListRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Account.Delete, request).then(() => undefined));
  },

  setStatusAccount: async (request: StatusRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Account.State, request).then(() => undefined));
  },

  assignAccount: async (request: AssignRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Account.Assign, request).then(() => undefined));
  },
};

export default accountService;
