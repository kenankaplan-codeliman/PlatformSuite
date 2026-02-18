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
  bulkDeleteContacts: () => Promise<void>;
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
      // Initial state
      contacts: [],
      hasMore: false,
      page: 1,
      pageSize: 10,
      filters: initialFilters,
      selectedRowKeys: [],
      currentContact: null,

      fetchContacts: async () => {
        const { page, pageSize, filters } = get();
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Kişi listesi yükleniyor...', 'Lütfen bekleyiniz...');

          const response = await contactService.getContacts(page, pageSize, filters);
          set({
            contacts: response.data,
            hasMore: response.hasMore,
          });

          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Kişi listesi yüklenemedi', errorMessage);
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
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Kişi detayı yüklenemedi', errorMessage);
        }
      },

      setPagination: (params: PaginationParams) => {
        const currentState = get();
        const newPage = params.page ?? currentState.page;
        const newPageSize = params.pageSize ?? currentState.pageSize;

        const finalPage =
          params.pageSize !== undefined && params.pageSize !== currentState.pageSize
            ? 1
            : newPage;

        set({ page: finalPage, pageSize: newPageSize });
        get().fetchContacts();
      },

      setFilters: (filters: ContactListFilters) => {
        set({ filters, page: 1 });
        get().fetchContacts();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchContacts();
      },

      setSelectedRowKeys: (keys: string[]) => {
        set({ selectedRowKeys: keys });
      },

      clearSelectedRowKeys: () => {
        set({ selectedRowKeys: [] });
      },

      createContact: async (contactData) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Kişi oluşturuluyor...', 'Lütfen bekleyiniz...');
          const newContact = await contactService.createContact(contactData);
          set({ currentContact: newContact });
          clearState();
          return newContact;
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Kişi oluşturulamadı', errorMessage);
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
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Kişi güncellenemedi', errorMessage);
          throw error;
        }
      },

      deleteContact: async (id: string) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişi siliniyor...', 'Lütfen bekleyiniz...');
          await contactService.deleteContact(id);
          await get().fetchContacts();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Kişi silinemedi', errorMessage);
          throw error;
        }
      },

      bulkDeleteContacts: async () => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;

        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Kişiler siliniyor...', 'Lütfen bekleyiniz...');
          await contactService.bulkDeleteContacts(selectedRowKeys);
          await get().fetchContacts();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Kişiler silinemedi', errorMessage);
        }
      },

      setCurrentContact: (contact: ContactDetailItem | null) => {
        set({ currentContact: contact });
      },
    }),
    { name: 'contact-store' }
  )
);

export default useContactStore;
