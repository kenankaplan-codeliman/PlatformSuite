import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AccountListItem,
  AccountDetailItem,
  AccountListFilters,
} from '@/types/account.types';
import accountService from '@/services/account.service';

import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';
import type { PaginationParams } from '@/types/common.types';

interface AccountState {
  // List state
  accounts: AccountListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
  filters: AccountListFilters;
  selectedRowKeys: string[];

  // Detail state
  currentAccount: AccountDetailItem | null;

  // Actions
  fetchAccounts: () => Promise<void>;
  fetchAccountById: (id: string) => Promise<void>;
  setPagination: (params: PaginationParams) => void;
  setFilters: (filters: AccountListFilters) => void;
  resetFilters: () => void;
  setSelectedRowKeys: (keys: string[]) => void;
  clearSelectedRowKeys: () => void;
  createAccount: (
    account: Omit<Partial<AccountDetailItem>, 'id' | 'createdAt' | 'createdBy'>
  ) => Promise<AccountDetailItem>;
  updateAccount: (account: Partial<AccountDetailItem>) => Promise<AccountDetailItem>;
  deleteAccount: (id: string) => Promise<void>;
  bulkDeleteAccounts: () => Promise<void>;
  setCurrentAccount: (account: AccountDetailItem | null) => void;
}

const initialFilters: AccountListFilters = {
  accountName: undefined,
  accountType: undefined,
  industry: undefined,
  isActive: undefined,
};

export const useAccountStore = create<AccountState>()(
  devtools(
    (set, get) => ({
      // Initial state
      accounts: [],
      hasMore: false,
      page: 1,
      pageSize: 10,
      filters: initialFilters,
      selectedRowKeys: [],
      currentAccount: null,

      // Fetch accounts list
      fetchAccounts: async () => {
        const { page, pageSize, filters } = get();
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Firma listesi yükleniyor...', 'Lütfen bekleyiniz...');

          const response = await accountService.getAccounts(page, pageSize, filters);
          set({
            accounts: response.data,
            hasMore: response.hasMore,
          });

          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Firma listesi yüklenemedi', errorMessage);
        }
      },

      // Fetch single account
      fetchAccountById: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Firma detayı yükleniyor...', 'Lütfen bekleyiniz...');

          const account = await accountService.getAccountById(id);

          set({
            currentAccount: account,
          });

          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Firma detayı yüklenemedi', errorMessage);
        }
      },

      // Pagination
      setPagination: (params: PaginationParams) => {
        const currentState = get();
        const newPage = params.page ?? currentState.page;
        const newPageSize = params.pageSize ?? currentState.pageSize;

        // pageSize değiştiyse sayfa 1'e dön
        const finalPage =
          params.pageSize !== undefined && params.pageSize !== currentState.pageSize
            ? 1
            : newPage;

        set({
          page: finalPage,
          pageSize: newPageSize,
        });

        get().fetchAccounts();
      },

      // Filters
      setFilters: (filters: AccountListFilters) => {
        set({ filters, page: 1 });
        get().fetchAccounts();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchAccounts();
      },

      // Selection
      setSelectedRowKeys: (keys: string[]) => {
        set({ selectedRowKeys: keys });
      },

      clearSelectedRowKeys: () => {
        set({ selectedRowKeys: [] });
      },

      // CRUD operations
      createAccount: async (accountData) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Firma oluşturuluyor...', 'Lütfen bekleyiniz...');
          const newAccount = await accountService.createAccount(accountData);
          set({ currentAccount: newAccount });
          clearState();
          return newAccount;
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Firma oluşturulamadı', errorMessage);
          throw error;
        }
      },

      updateAccount: async (accountData: Partial<AccountDetailItem>) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Firma güncelleniyor...', 'Lütfen bekleyiniz...');
          const updatedAccount = await accountService.updateAccount(accountData);
          set({ currentAccount: updatedAccount });
          clearState();
          return updatedAccount;
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Firma güncellenemedi', errorMessage);
          throw error;
        }
      },

      deleteAccount: async (id: string) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firma siliniyor...', 'Lütfen bekleyiniz...');
          await accountService.deleteAccount(id);
          await get().fetchAccounts();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Firma silinemedi', errorMessage);
          throw error;
        }
      },

      bulkDeleteAccounts: async () => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;

        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, "Firmalar siliniyor...", 'Lütfen bekleyiniz...');
          await accountService.bulkDeleteAccounts(selectedRowKeys);
          await get().fetchAccounts();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Firmalar silinemedi", errorMessage);
        }
      },

      setCurrentAccount: (account: AccountDetailItem | null) => {
        set({ currentAccount: account });
      },
    }),
    { name: 'account-store' }
  )
);

export default useAccountStore;
