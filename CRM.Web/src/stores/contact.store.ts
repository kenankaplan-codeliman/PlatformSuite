import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ContactListItem,
  ContactDetailItem,
  ContactListFilters,
} from '@/types/contact.types';
import contactService from '@/services/contact.service';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';
import type { PaginationParams } from '@/types/common.types';
import type { EntityReference } from '@/types/entity.lookup.types';

interface ContactState {
  // List state
  contacts: ContactListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
  filters: ContactListFilters;
  selectedRowKeys: string[];

  // Detail state
  currentContact: ContactDetailItem | null;

  // Actions
  fetchContacts: () => Promise<void>;
  fetchContactById: (id: string) => Promise<void>;
  setPagination: (params: PaginationParams) => void;
  setFilters: (filters: ContactListFilters) => void;
  resetFilters: () => void;
  setSelectedRowKeys: (keys: string[]) => void;
  clearSelectedRowKeys: () => void;
  createContact: (
    contact: Omit<Partial<ContactDetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<ContactDetailItem>;
  updateContact: (contact: Partial<ContactDetailItem>) => Promise<ContactDetailItem>;
  deleteContact: (id: string) => Promise<void>;

  // Bulk actions
  bulkDeleteContacts: () => Promise<void>;
  bulkActivateContacts: () => Promise<void>;
  bulkDeactivateContacts: () => Promise<void>;
  bulkAssignContacts: (entity: EntityReference | EntityReference[] | null) => Promise<void>;

  // Row-level actions
  activateContact: (id: string) => Promise<void>;
  deactivateContact: (id: string) => Promise<void>;
  assignContact: (id: string, entity: EntityReference | EntityReference[] | null) => Promise<void>;

  setCurrentContact: (contact: ContactDetailItem | null) => void;
}

const initialFilters: ContactListFilters = {
  contactName: undefined,
  accountId: undefined,
  title: undefined,
  department: undefined,
  isActive: undefined,
};

export const useContactStore = create<ContactState>()(
  devtools(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────
      contacts: [],
      hasMore: false,
      page: 1,
      pageSize: 10,
      filters: initialFilters,
      selectedRowKeys: [],
      currentContact: null,

      // ── Fetch ──────────────────────────────────────────────────────────
      fetchContacts: async () => {
        const { page, pageSize, filters } = get();
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişi listesi yükleniyor...', 'Lütfen bekleyiniz...');
          const response = await contactService.getContacts(page, pageSize, filters);
          set({ contacts: response.data, hasMore: response.hasMore });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Kişi listesi yüklenemedi', handleError(error));
        }
      },

      fetchContactById: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişi detayı yükleniyor...', 'Lütfen bekleyiniz...');
          const contact = await contactService.getContactById(id);
          set({ currentContact: contact });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Kişi detayı yüklenemedi', handleError(error));
        }
      },

      // ── Pagination ─────────────────────────────────────────────────────
      setPagination: (params: PaginationParams) => {
        const { page, pageSize } = get();
        const newPageSize = params.pageSize ?? pageSize;
        const finalPage = params.pageSize !== undefined && params.pageSize !== pageSize ? 1 : (params.page ?? page);
        set({ page: finalPage, pageSize: newPageSize });
        get().fetchContacts();
      },

      // ── Filters ────────────────────────────────────────────────────────
      setFilters: (filters: ContactListFilters) => {
        set({ filters, page: 1 });
        get().fetchContacts();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchContacts();
      },

      // ── Selection ──────────────────────────────────────────────────────
      setSelectedRowKeys: (keys: string[]) => set({ selectedRowKeys: keys }),
      clearSelectedRowKeys: () => set({ selectedRowKeys: [] }),

      // ── CRUD ───────────────────────────────────────────────────────────
      createContact: async (contactData) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişi oluşturuluyor...', 'Lütfen bekleyiniz...');
          const newContact = await contactService.createContact(contactData);
          set({ currentContact: newContact });
          clearState();
          return newContact;
        } catch (error) {
          setState(StateType.Error, 'Kişi oluşturulamadı', handleError(error));
          throw error;
        }
      },

      updateContact: async (contactData: Partial<ContactDetailItem>) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişi güncelleniyor...', 'Lütfen bekleyiniz...');
          const updatedContact = await contactService.updateContact(contactData);
          set({ currentContact: updatedContact });
          clearState();
          return updatedContact;
        } catch (error) {
          setState(StateType.Error, 'Kişi güncellenemedi', handleError(error));
          throw error;
        }
      },

      deleteContact: async (id: string) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişi siliniyor...', 'Lütfen bekleyiniz...');
          await contactService.deleteContact({ ids: [id] });
          await get().fetchContacts();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Kişi silinemedi', handleError(error));
          throw error;
        }
      },

      // ── Bulk Actions ───────────────────────────────────────────────────
      bulkDeleteContacts: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişiler siliniyor...', 'Lütfen bekleyiniz...');
          await contactService.deleteContact({ ids: selectedRowKeys });
          await get().fetchContacts();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Kişiler silinemedi', handleError(error));
        }
      },

      bulkActivateContacts: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişiler etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await contactService.setStatusContact({ ids: selectedRowKeys, isActive: true });
          await get().fetchContacts();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Kişiler etkinleştirilemedi', handleError(error));
        }
      },

      bulkDeactivateContacts: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişiler pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await contactService.setStatusContact({ ids: selectedRowKeys, isActive: false });
          await get().fetchContacts();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Kişiler pasifleştirilemedi', handleError(error));
        }
      },

      bulkAssignContacts: async (entity) => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişiler atanıyor...', 'Lütfen bekleyiniz...');
          const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
          if (!ownerId) return;
          await contactService.assignContact({ ids: selectedRowKeys, ownerId });
          await get().fetchContacts();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Kişiler atanamadı', handleError(error));
        }
      },

      // ── Row-level Actions ──────────────────────────────────────────────
      activateContact: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişi etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await contactService.setStatusContact({ ids: [id], isActive: true });
          await get().fetchContacts();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Kişi etkinleştirilemedi', handleError(error));
        }
      },

      deactivateContact: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişi pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await contactService.setStatusContact({ ids: [id], isActive: false });
          await get().fetchContacts();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Kişi pasifleştirilemedi', handleError(error));
        }
      },

      assignContact: async (id: string, entity) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişi atanıyor...', 'Lütfen bekleyiniz...');
          const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
          if (!ownerId) return;
          await contactService.assignContact({ ids: [id], ownerId });
          await get().fetchContacts();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Kişi atanamadı', handleError(error));
        }
      },

      setCurrentContact: (contact: ContactDetailItem | null) => set({ currentContact: contact }),
    }),
    { name: 'contact-store' }
  )
);

export default useContactStore;