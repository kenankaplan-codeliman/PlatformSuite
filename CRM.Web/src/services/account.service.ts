import type {
  AccountDetailItem,
  AccountListRequest,
  AccountListFilters,
  AccountListResponse,
} from '@/types/account.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/config/service.paths';
import type { IdListRequest, IdRequest } from '@/types/common.types';

export const accountService = {
  // Get paginated list of accounts with optional filters
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

  // Get single account by ID
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

  // Create new account
  createAccount: async (
    account: Omit<Partial<AccountDetailItem>, 'id' | 'createdAt' | 'createdBy'>
  ): Promise<AccountDetailItem> => {
    const response = await apiClient.post<AccountDetailItem>(
      ServicePath.Account.Create,
      account
    );
    return response.data;
  },

  // Update existing account
  updateAccount: async (
    account: Partial<AccountDetailItem>
  ): Promise<AccountDetailItem> => {

    const response = await apiClient.post<AccountDetailItem>(
      ServicePath.Account.Update,
      account
    );

    return response.data;
  },

  // Delete account (soft delete)
  deleteAccount: async (id: string): Promise<void> => {
    const request: IdRequest = {
      id: id,
    };

    await apiClient.post(ServicePath.Account.Delete, request);
  },

  // Bulk delete accounts
  bulkDeleteAccounts: async (ids: string[]): Promise<void> => {
    const request: IdListRequest = {
      ids: ids,
    };

    await apiClient.post(ServicePath.Account.BulkDelete, request);
  },

  // Export accounts to Excel
  exportAccounts: async (filters?: AccountListFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default accountService;
