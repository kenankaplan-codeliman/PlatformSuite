import contactService from '@/services/contact.service';
import type { ContactListItem, ContactDetailItem, ContactListFilters, ContactStatusValue } from '@/types/contact.types';
import { createEntityStore } from './entity.store.factory';

const _store = createEntityStore<ContactListItem, ContactDetailItem, ContactListFilters, ContactStatusValue>({
  storeName: 'contact-store',
  defaultPageSize: 10,
  initialFilters: {
    contactName: undefined,
    accountId: undefined,
    title: undefined,
    department: undefined,
    isActive: undefined,
  },
  labels: { singular: 'Kişi', plural: 'Kişiler' },
  service: {
    getList: (page, pageSize, filters) => contactService.getContacts(page, pageSize, filters),
    getById: (id) => contactService.getContactById(id),
    create: (data) => contactService.createContact(data as Omit<Partial<ContactDetailItem>, 'id' | 'createdAt' | 'updatedAt'>),
    update: (data) => contactService.updateContact(data as Partial<ContactDetailItem>),
    delete: (payload) => contactService.deleteContact(payload),
    setStatus: (payload) => contactService.setStatusContact(payload),
    assign: (payload) => contactService.assignContact(payload),
    updateStatus: (ids, status) => contactService.updateContactStatus(ids, status),
  },
});

// ─── Wrapper hook — entity-specific aliases (backward compatible) ─────────────

export function useContactStore() {
  const s = _store();
  return {
    ...s,
    contacts: s.items as ContactListItem[],
    currentContact: s.currentItem as ContactDetailItem | null,
    setCurrentContact: s.setCurrentItem,
    fetchContacts: s.fetchItems,
    fetchContactById: s.fetchItemById,
    createContact: s.createItem as (data: Omit<Partial<ContactDetailItem>, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ContactDetailItem>,
    updateContact: s.updateItem as (data: Partial<ContactDetailItem>) => Promise<ContactDetailItem>,
    deleteContact: s.deleteItem,
    bulkDeleteContacts: s.bulkDelete,
    bulkActivateContacts: s.bulkActivate,
    bulkDeactivateContacts: s.bulkDeactivate,
    bulkAssignContacts: s.bulkAssign,
    bulkUpdateStatus: s.bulkUpdateStatus,
    activateContact: s.activateItem,
    deactivateContact: s.deactivateItem,
    assignContact: s.assignItem,
  };
}

useContactStore.getState = _store.getState;

export default useContactStore;
