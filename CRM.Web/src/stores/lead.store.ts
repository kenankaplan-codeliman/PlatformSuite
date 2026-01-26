import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Lead, LeadListFilters, LeadStatusValue } from '@/types/lead.types';
import leadService from '@/services/lead.service';

interface LeadState {
  // List state
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: LeadListFilters;
  selectedRowKeys: string[];

  // Detail state
  currentLead: Lead | null;
  detailLoading: boolean;
  detailError: string | null;

  // Actions
  fetchLeads: () => Promise<void>;
  fetchLeadById: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setFilters: (filters: LeadListFilters) => void;
  resetFilters: () => void;
  setSelectedRowKeys: (keys: string[]) => void;
  clearSelectedRowKeys: () => void;
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'createdBy'>) => Promise<Lead>;
  updateLead: (id: string, lead: Partial<Lead>) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  bulkDeleteLeads: () => Promise<void>;
  bulkUpdateStatus: (status: LeadStatusValue) => Promise<void>;
  setCurrentLead: (lead: Lead | null) => void;
  clearError: () => void;
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
      total: 0,
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
        set({ loading: true, error: null });

        try {
          const response = await leadService.getLeads(page, pageSize, filters);
          set({
            leads: response.data,
            total: response.total,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lead listesi yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      // Fetch single lead
      fetchLeadById: async (id: string) => {
        set({ detailLoading: true, detailError: null });

        try {
          const lead = await leadService.getLeadById(id);
          set({
            currentLead: lead,
            detailLoading: false,
          });
        } catch (error) {
          set({
            detailError: error instanceof Error ? error.message : 'Lead detayı yüklenirken hata oluştu',
            detailLoading: false,
          });
        }
      },

      // Pagination
      setPage: (page: number) => {
        set({ page });
        get().fetchLeads();
      },

      setPageSize: (pageSize: number) => {
        set({ pageSize, page: 1 });
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
        set({ loading: true, error: null });
        try {
          const newLead = await leadService.createLead(leadData);
          await get().fetchLeads();
          return newLead;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lead oluşturulurken hata oluştu',
            loading: false,
          });
          throw error;
        }
      },

      updateLead: async (id: string, leadData: Partial<Lead>) => {
        set({ detailLoading: true, detailError: null });
        try {
          const updatedLead = await leadService.updateLead(id, leadData);
          set({ currentLead: updatedLead, detailLoading: false });
          return updatedLead;
        } catch (error) {
          set({
            detailError: error instanceof Error ? error.message : 'Lead güncellenirken hata oluştu',
            detailLoading: false,
          });
          throw error;
        }
      },

      deleteLead: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await leadService.deleteLead(id);
          await get().fetchLeads();
          get().clearSelectedRowKeys();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lead silinirken hata oluştu',
            loading: false,
          });
          throw error;
        }
      },

      bulkDeleteLeads: async () => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;

        set({ loading: true, error: null });
        try {
          await leadService.bulkDeleteLeads(selectedRowKeys);
          await get().fetchLeads();
          get().clearSelectedRowKeys();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lead\'ler silinirken hata oluştu',
            loading: false,
          });
          throw error;
        }
      },

      bulkUpdateStatus: async (status: LeadStatusValue) => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;

        set({ loading: true, error: null });
        try {
          await leadService.bulkUpdateStatus(selectedRowKeys, status);
          await get().fetchLeads();
          get().clearSelectedRowKeys();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lead durumları güncellenirken hata oluştu',
            loading: false,
          });
          throw error;
        }
      },

      setCurrentLead: (lead: Lead | null) => {
        set({ currentLead: lead });
      },

      clearError: () => {
        set({ error: null, detailError: null });
      },
    }),
    { name: 'lead-store' }
  )
);

export default useLeadStore;
