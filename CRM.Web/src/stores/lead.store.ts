import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  LeadListItem,
  LeadDetailItem,
  LeadListFilters,
  LeadStatusValue,
} from '@/types/lead.types';
import leadService from '@/services/lead.service';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';
import type { PaginationParams } from '@/types/common.types';
import type { EntityReference } from '@/types/entity.lookup.types';

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
  createLead: (
    lead: Omit<Partial<LeadDetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<LeadDetailItem>;
  updateLead: (lead: Partial<LeadDetailItem>) => Promise<LeadDetailItem>;
  deleteLead: (id: string) => Promise<void>;

  // Bulk actions
  bulkDeleteLeads: () => Promise<void>;
  bulkActivateLeads: () => Promise<void>;
  bulkDeactivateLeads: () => Promise<void>;
  bulkUpdateStatus: (status: LeadStatusValue) => Promise<void>;
  bulkAssignLeads: (entity: EntityReference | EntityReference[] | null) => Promise<void>;

  // Row-level actions
  activateLead: (id: string) => Promise<void>;
  deactivateLead: (id: string) => Promise<void>;
  assignLead: (id: string, entity: EntityReference | EntityReference[] | null) => Promise<void>;

  setCurrentLead: (lead: LeadDetailItem | null) => void;
}

const initialFilters: LeadListFilters = {
  companyName: undefined,
  leadStatus: undefined,
  leadRating: undefined,
  leadSource: undefined,
  industry: undefined,
  isActive: undefined,
};

export const useLeadStore = create<LeadState>()(
  devtools(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────
      leads: [],
      hasMore: false,
      page: 1,
      pageSize: 10,
      filters: initialFilters,
      selectedRowKeys: [],
      currentLead: null,

      // ── Fetch ──────────────────────────────────────────────────────────
      fetchLeads: async () => {
        const { page, pageSize, filters } = get();
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Lead listesi yükleniyor...', 'Lütfen bekleyiniz...');
          const response = await leadService.getLeads(page, pageSize, filters);
          set({ leads: response.data, hasMore: response.hasMore });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Lead listesi yüklenemedi', handleError(error));
        }
      },

      fetchLeadById: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Lead detayı yükleniyor...', 'Lütfen bekleyiniz...');
          const lead = await leadService.getLeadById(id);
          set({ currentLead: lead });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Lead detayı yüklenemedi', handleError(error));
        }
      },

      // ── Pagination ─────────────────────────────────────────────────────
      setPagination: (params: PaginationParams) => {
        const { page, pageSize } = get();
        const newPageSize = params.pageSize ?? pageSize;
        const finalPage = params.pageSize !== undefined && params.pageSize !== pageSize
          ? 1
          : (params.page ?? page);
        set({ page: finalPage, pageSize: newPageSize });
        get().fetchLeads();
      },

      // ── Filters ────────────────────────────────────────────────────────
      setFilters: (filters: LeadListFilters) => {
        set({ filters, page: 1 });
        get().fetchLeads();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchLeads();
      },

      // ── Selection ──────────────────────────────────────────────────────
      setSelectedRowKeys: (keys: string[]) => set({ selectedRowKeys: keys }),
      clearSelectedRowKeys: () => set({ selectedRowKeys: [] }),

      // ── CRUD ───────────────────────────────────────────────────────────
      createLead: async (leadData) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Lead oluşturuluyor...', 'Lütfen bekleyiniz...');
          const newLead = await leadService.createLead(leadData);
          set({ currentLead: newLead });
          clearState();
          return newLead;
        } catch (error) {
          setState(StateType.Error, 'Lead oluşturulamadı', handleError(error));
          throw error;
        }
      },

      updateLead: async (leadData: Partial<LeadDetailItem>) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Lead güncelleniyor...', 'Lütfen bekleyiniz...');
          const updated = await leadService.updateLead(leadData);
          set({ currentLead: updated });
          clearState();
          return updated;
        } catch (error) {
          setState(StateType.Error, 'Lead güncellenemedi', handleError(error));
          throw error;
        }
      },

      deleteLead: async (id: string) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Lead siliniyor...', 'Lütfen bekleyiniz...');
          await leadService.deleteLead({ ids: [id] });
          await get().fetchLeads();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Lead silinemedi', handleError(error));
          throw error;
        }
      },

      // ── Bulk Actions ───────────────────────────────────────────────────
      bulkDeleteLeads: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Leadler siliniyor...', 'Lütfen bekleyiniz...');
          await leadService.deleteLead({ ids: selectedRowKeys });
          await get().fetchLeads();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Leadler silinemedi', handleError(error));
        }
      },

      bulkActivateLeads: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Leadler etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await leadService.setStatusLead({ ids: selectedRowKeys, isActive: true });
          await get().fetchLeads();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Leadler etkinleştirilemedi', handleError(error));
        }
      },

      bulkDeactivateLeads: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Leadler pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await leadService.setStatusLead({ ids: selectedRowKeys, isActive: false });
          await get().fetchLeads();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Leadler pasifleştirilemedi', handleError(error));
        }
      },

      // Lead'e özgü: toplu durum güncelleme
      bulkUpdateStatus: async (status: LeadStatusValue) => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Durum güncelleniyor...', 'Lütfen bekleyiniz...');
          await leadService.updateLeadStatus(selectedRowKeys, status);
          await get().fetchLeads();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Durum güncellenemedi', handleError(error));
        }
      },

      bulkAssignLeads: async (entity) => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Leadler atanıyor...', 'Lütfen bekleyiniz...');
          const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
          if (!ownerId) return;
          await leadService.assignLead({ ids: selectedRowKeys, ownerId });
          await get().fetchLeads();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Leadler atanamadı', handleError(error));
        }
      },

      // ── Row-level Actions ──────────────────────────────────────────────
      activateLead: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Lead etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await leadService.setStatusLead({ ids: [id], isActive: true });
          await get().fetchLeads();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Lead etkinleştirilemedi', handleError(error));
        }
      },

      deactivateLead: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Lead pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await leadService.setStatusLead({ ids: [id], isActive: false });
          await get().fetchLeads();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Lead pasifleştirilemedi', handleError(error));
        }
      },

      assignLead: async (id: string, entity) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Lead atanıyor...', 'Lütfen bekleyiniz...');
          const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
          if (!ownerId) return;
          await leadService.assignLead({ ids: [id], ownerId });
          await get().fetchLeads();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Lead atanamadı', handleError(error));
        }
      },

      setCurrentLead: (lead: LeadDetailItem | null) => set({ currentLead: lead }),
    }),
    { name: 'lead-store' }
  )
);

export default useLeadStore;