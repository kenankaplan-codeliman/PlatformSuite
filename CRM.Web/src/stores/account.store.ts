import accountService from '@/services/account.service';
import type { AccountListItem, AccountDetailItem, AccountListFilters, AccountStatusValue } from '@/types/account.types';
import { createEntityStore } from './entity.store.factory';

const _store = createEntityStore<AccountListItem, AccountDetailItem, AccountListFilters, AccountStatusValue>({
  storeName: 'account-store',
  defaultPageSize: 10,
  initialFilters: {
    accountName: undefined,
    accountType: undefined,
    industry: undefined,
    isActive: undefined,
  },
  labels: { singular: 'Firma', plural: 'Firmalar' },
  service: {
    getList: (page, pageSize, filters) => accountService.getAccounts(page, pageSize, filters),
    getById: (id) => accountService.getAccountById(id),
    create: (data) => accountService.createAccount(data as Omit<Partial<AccountDetailItem>, 'id' | 'createdAt' | 'createdBy'>),
    update: (data) => accountService.updateAccount(data as Partial<AccountDetailItem>),
    delete: (payload) => accountService.deleteAccount(payload),
    setStatus: (payload) => accountService.setStatusAccount(payload),
    assign: (payload) => accountService.assignAccount(payload),
    updateStatus: (ids, status) => accountService.updateAccountStatus(ids, status),
  },
});

// ─── Wrapper hook — entity-specific aliases (backward compatible) ─────────────

export function useAccountStore() {
  const s = _store();
  return {
    ...s,
    accounts: s.items as AccountListItem[],
    currentAccount: s.currentItem as AccountDetailItem | null,
    setCurrentAccount: s.setCurrentItem,
    fetchAccounts: s.fetchItems,
    fetchAccountById: s.fetchItemById,
    createAccount: s.createItem as (data: Omit<Partial<AccountDetailItem>, 'id' | 'createdAt' | 'createdBy'>) => Promise<AccountDetailItem>,
    updateAccount: s.updateItem as (data: Partial<AccountDetailItem>) => Promise<AccountDetailItem>,
    deleteAccount: s.deleteItem,
    bulkDeleteAccounts: s.bulkDelete,
    bulkActivateAccounts: s.bulkActivate,
    bulkDeactivateAccounts: s.bulkDeactivate,
    bulkAssignAccounts: s.bulkAssign,
    bulkUpdateStatus: s.bulkUpdateStatus,
    activateAccount: s.activateItem,
    deactivateAccount: s.deactivateItem,
    assignAccount: s.assignItem,
  };
}

useAccountStore.getState = _store.getState;

export default useAccountStore;
