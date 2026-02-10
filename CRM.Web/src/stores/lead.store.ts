import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { LeadListItem, LeadDetailItem, LeadListFilters, LeadStatusValue } from '@/types/lead.types';
import leadService from '@/services/lead.service';

import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from "@/stores/process.state.store";
import type { PaginationParams } from '@/types/common.types';

interface LeadState {
  // List state
  leads: LeadListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
  filters: LeadListFilters;
  selectedRowKeys: string[];

  // Detail state
  currentLead: LeadDetailItem | null;
  

  // Actions
  fetchLeads: () => Promise<void>;
  fetchLeadById: (id: string) => Promise<void>;
  setPagination: (params: PaginationParams) => void;
  setFilters: (filters: LeadListFilters) => void;
  resetFilters: () => void;
  setSelectedRowKeys: (keys: string[]) => void;
  clearSelectedRowKeys: () => void;
  createLead: (lead: Omit<Partial<LeadDetailItem>, 'id' | 'createdAt' | 'createdBy'>) => Promise<LeadDetailItem>;
  updateLead: (lead: Partial<LeadDetailItem>) => Promise<LeadDetailItem>;
  deleteLead: (id: string) => Promise<void>;
  bulkDeleteLeads: () => Promise<void>;
  bulkUpdateStatus: (status: LeadStatusValue) => Promise<void>;
  setCurrentLead: (lead: LeadDetailItem | null) => void;
}

const initialFilters: LeadListFilters = {
  companyName: undefined,
  firstName: undefined,
  lastName: undefined,
  leadStatus: undefined,
  leadSource: undefined,
  leadRating: undefined,
  industry: undefined,
  isActive: undefined,
};

export const useLeadStore = create<LeadState>()(
  devtools(
    (set, get) => ({
      // Initial state
      leads: [],
      hasMore: false,
      page: 1,
      pageSize: 10,
      loading: false,
      error: null,
      filters: initialFilters,
      selectedRowKeys: [],
      currentLead: null,
      detailLoading: false,
      detailError: null,

      // Fetch leads list
      fetchLeads: async () => {
        const { page, pageSize, filters } = get();
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, "Lead listesi yükleniyor...", "Lütfen bekleyiniz...");

          const response = await leadService.getLeads(page, pageSize, filters);
          set({
            leads: response.data,
            hasMore: response.hasMore,
          });

          clearState();

        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Lead listesi yüklenemedi", errorMessage);
        }
      },

      // Fetch single lead
      fetchLeadById: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, "Lead detayı yükleniyor...", "Lütfen bekleyiniz...");

          const lead = await leadService.getLeadById(id);

          set({
            currentLead: lead,
          });

          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Lead detayı yüklenemedi", errorMessage);
        }
      },

      // Pagination - tek metod ile page ve pageSize güncelleme
      setPagination: (params: PaginationParams) => {
        const currentState = get();
        const newPage = params.page ?? currentState.page;
        const newPageSize = params.pageSize ?? currentState.pageSize;
        
        // pageSize değiştiyse sayfa 1'e dön
        const finalPage = params.pageSize !== undefined && params.pageSize !== currentState.pageSize 
          ? 1 
          : newPage;

        set({ 
          page: finalPage, 
          pageSize: newPageSize 
        });
        
        // Tek bir fetchLeads çağrısı
        get().fetchLeads();
      },

      // Filters
      setFilters: (filters: LeadListFilters) => {
        set({ filters, page: 1 });
        get().fetchLeads();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchLeads();
      },

      // Selection
      setSelectedRowKeys: (keys: string[]) => {
        set({ selectedRowKeys: keys });
      },

      clearSelectedRowKeys: () => {
        set({ selectedRowKeys: [] });
      },

      // CRUD operations
      createLead: async (leadData) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, "Lead oluşturuluyor...", "Lütfen bekleyiniz...");
          const newLead = await leadService.createLead(leadData);
          //await get().fetchLeads();
          set({ currentLead: newLead });
          clearState();
          return newLead;
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Lead oluşturulamadı", errorMessage);
          throw error;
        }
      },

      updateLead: async (leadData: Partial<LeadDetailItem>) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, "Lead güncelleniyor...", "Lütfen bekleyiniz...");
          const updatedLead = await leadService.updateLead(leadData.id as string, leadData);
          set({ currentLead: updatedLead });
          clearState();
          
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Lead güncellenemedi", errorMessage);
          throw error;
        }
      },

      deleteLead: async (id: string) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, "Lead siliniyor...", "Lütfen bekleyiniz...");
          await leadService.deleteLead(id);
          await get().fetchLeads();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Lead silinemedi", errorMessage);
          throw error;
        }
      },

      bulkDeleteLeads: async () => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;

        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, "Lead\'ler siliniyor...", "Lütfen bekleyiniz...");
          await leadService.bulkDeleteLeads(selectedRowKeys);
          await get().fetchLeads();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Lead\'ler silinemedi", errorMessage);
          //throw error;
        }
      },

      bulkUpdateStatus: async (status: LeadStatusValue) => {
        
        const { setState } = useProcessState.getState();

        const { selectedRowKeys } = get();

        if (selectedRowKeys.length === 0) return;

        
        try {
          setState(StateType.Loading, "Lead\'ler güncelleniyor...", "Lütfen bekleyiniz...");
          await leadService.bulkUpdateStatus(selectedRowKeys, status);
          await get().fetchLeads();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Lead\'ler güncellenemedi", errorMessage);
          throw error;
        }
      },

      setCurrentLead: (lead: LeadDetailItem | null) => {
        set({ currentLead: lead });
      },
      
    }),
    { name: 'lead-store' }
  )
);

export default useLeadStore;
