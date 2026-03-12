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
import type { EntityReference } from '@/types/entity.lookup.types';

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

  // Bulk actions
  bulkDeleteAccounts: () => Promise<void>;
  bulkActivateAccounts: () => Promise<void>;
  bulkDeactivateAccounts: () => Promise<void>;
  bulkAssignAccounts: (entity: EntityReference | EntityReference[] | null) => Promise<void>;

  // Row-level actions
  activateAccount: (id: string) => Promise<void>;
  deactivateAccount: (id: string) => Promise<void>;
  assignAccount: (id: string, entity: EntityReference | EntityReference[] | null) => Promise<void>;

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
      // ── Initial state ──────────────────────────────────────────────────
      accounts: [],
      hasMore: false,
      page: 1,
      pageSize: 10,
      filters: initialFilters,
      selectedRowKeys: [],
      currentAccount: null,

      // ── Fetch ──────────────────────────────────────────────────────────
      fetchAccounts: async () => {
        const { page, pageSize, filters } = get();
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firma listesi yükleniyor...', 'Lütfen bekleyiniz...');
          const response = await accountService.getAccounts(page, pageSize, filters);
          set({ accounts: response.data, hasMore: response.hasMore });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Firma listesi yüklenemedi', handleError(error));
        }
      },

      fetchAccountById: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firma detayı yükleniyor...', 'Lütfen bekleyiniz...');
          const account = await accountService.getAccountById(id);
          set({ currentAccount: account });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Firma detayı yüklenemedi', handleError(error));
        }
      },

      // ── Pagination ─────────────────────────────────────────────────────
      setPagination: (params: PaginationParams) => {
        const { page, pageSize } = get();
        const newPageSize = params.pageSize ?? pageSize;
        const finalPage = params.pageSize !== undefined && params.pageSize !== pageSize ? 1 : (params.page ?? page);
        set({ page: finalPage, pageSize: newPageSize });
        get().fetchAccounts();
      },

      // ── Filters ────────────────────────────────────────────────────────
      setFilters: (filters: AccountListFilters) => {
        set({ filters, page: 1 });
        get().fetchAccounts();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchAccounts();
      },

      // ── Selection ──────────────────────────────────────────────────────
      setSelectedRowKeys: (keys: string[]) => set({ selectedRowKeys: keys }),
      clearSelectedRowKeys: () => set({ selectedRowKeys: [] }),

      // ── CRUD ───────────────────────────────────────────────────────────
      createAccount: async (accountData) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firma oluşturuluyor...', 'Lütfen bekleyiniz...');
          const newAccount = await accountService.createAccount(accountData);
          set({ currentAccount: newAccount });
          clearState();
          return newAccount;
        } catch (error) {
          setState(StateType.Error, 'Firma oluşturulamadı', handleError(error));
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
          setState(StateType.Error, 'Firma güncellenemedi', handleError(error));
          throw error;
        }
      },

      deleteAccount: async (id: string) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firma siliniyor...', 'Lütfen bekleyiniz...');
          await accountService.deleteAccount({ids:[id]});
          await get().fetchAccounts();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Firma silinemedi', handleError(error));
          throw error;
        }
      },

      // ── Bulk Actions ───────────────────────────────────────────────────
      bulkDeleteAccounts: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firmalar siliniyor...', 'Lütfen bekleyiniz...');
          await accountService.deleteAccount({ids:selectedRowKeys});
          await get().fetchAccounts();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Firmalar silinemedi', handleError(error));
        }
      },

      bulkActivateAccounts: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firmalar etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await accountService.setStatusAccount({ids: selectedRowKeys, isActive:true});
          await get().fetchAccounts();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Firmalar etkinleştirilemedi', handleError(error));
        }
      },

      bulkDeactivateAccounts: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firmalar pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await accountService.setStatusAccount({ids: selectedRowKeys, isActive:false});
          await get().fetchAccounts();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Firmalar pasifleştirilemedi', handleError(error));
        }
      },

      bulkAssignAccounts: async (entity) => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firmalar atanıyor...', 'Lütfen bekleyiniz...');

          const ownerId = Array.isArray(entity)
            ? entity[0]?.id
            : entity?.id;

          if (!ownerId) return;

          await accountService.assignAccount({ids:selectedRowKeys, ownerId: ownerId});
          await get().fetchAccounts();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Firmalar atanamadı', handleError(error));
        }
      },

      // ── Row-level Actions ──────────────────────────────────────────────
      activateAccount: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firma etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await accountService.setStatusAccount({ids:[id], isActive:true});
          await get().fetchAccounts();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Firma etkinleştirilemedi', handleError(error));
        }
      },

      deactivateAccount: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firma pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await accountService.setStatusAccount({ids:[id], isActive:false});
          await get().fetchAccounts();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Firma pasifleştirilemedi', handleError(error));
        }
      },

      assignAccount: async (id: string, entity) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Firma atanıyor...', 'Lütfen bekleyiniz...');

           const ownerId = Array.isArray(entity)
            ? entity[0]?.id
            : entity?.id;

          if (!ownerId) return;

          await accountService.assignAccount({ids:[id], ownerId: ownerId});

          await get().fetchAccounts();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Firma atanamadı', handleError(error));
        }
      },

      setCurrentAccount: (account: AccountDetailItem | null) => set({ currentAccount: account }),
    }),
    { name: 'account-store' }
  )
);

export default useAccountStore;