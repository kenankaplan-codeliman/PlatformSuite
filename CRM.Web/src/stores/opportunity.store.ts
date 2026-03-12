import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  OpportunityListItem,
  OpportunityDetailItem,
  OpportunityListFilters,
} from '@/types/opportunity.types';
import opportunityService from '@/services/opportunity.service';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';
import type { PaginationParams } from '@/types/common.types';
import type { EntityReference } from '@/types/entity.lookup.types';

interface OpportunityState {
  // List state
  opportunities: OpportunityListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
  filters: OpportunityListFilters;
  selectedRowKeys: string[];

  // Detail state
  currentOpportunity: OpportunityDetailItem | null;

  // Actions
  fetchOpportunities: () => Promise<void>;
  fetchOpportunityById: (id: string) => Promise<void>;
  setPagination: (params: PaginationParams) => void;
  setFilters: (filters: OpportunityListFilters) => void;
  resetFilters: () => void;
  setSelectedRowKeys: (keys: string[]) => void;
  clearSelectedRowKeys: () => void;
  createOpportunity: (
    opportunity: Omit<Partial<OpportunityDetailItem>, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<OpportunityDetailItem>;
  updateOpportunity: (opportunity: Partial<OpportunityDetailItem>) => Promise<OpportunityDetailItem>;
  deleteOpportunity: (id: string) => Promise<void>;

  // Bulk actions
  bulkDeleteOpportunities: () => Promise<void>;
  bulkActivateOpportunities: () => Promise<void>;
  bulkDeactivateOpportunities: () => Promise<void>;
  bulkAssignOpportunities: (entity: EntityReference | EntityReference[] | null) => Promise<void>;

  // Row-level actions
  activateOpportunity: (id: string) => Promise<void>;
  deactivateOpportunity: (id: string) => Promise<void>;
  assignOpportunity: (id: string, entity: EntityReference | EntityReference[] | null) => Promise<void>;

  setCurrentOpportunity: (opportunity: OpportunityDetailItem | null) => void;
}

const initialFilters: OpportunityListFilters = {
  name: undefined,
  stage: undefined,
  accountId: undefined,
  source: undefined,
  isActive: undefined,
};

export const useOpportunityStore = create<OpportunityState>()(
  devtools(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────
      opportunities: [],
      hasMore: false,
      page: 1,
      pageSize: 50,
      filters: initialFilters,
      selectedRowKeys: [],
      currentOpportunity: null,

      // ── Fetch ──────────────────────────────────────────────────────────
      fetchOpportunities: async () => {
        const { page, pageSize, filters } = get();
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsatlar yükleniyor...', 'Lütfen bekleyiniz...');
          const response = await opportunityService.getOpportunities(page, pageSize, filters);
          set({ opportunities: response.data, hasMore: response.hasMore });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Fırsatlar yüklenemedi', handleError(error));
        }
      },

      fetchOpportunityById: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsat detayı yükleniyor...', 'Lütfen bekleyiniz...');
          const opportunity = await opportunityService.getOpportunityById(id);
          set({ currentOpportunity: opportunity });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Fırsat detayı yüklenemedi', handleError(error));
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
        get().fetchOpportunities();
      },

      // ── Filters ────────────────────────────────────────────────────────
      setFilters: (filters: OpportunityListFilters) => {
        set({ filters, page: 1 });
        get().fetchOpportunities();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchOpportunities();
      },

      // ── Selection ──────────────────────────────────────────────────────
      setSelectedRowKeys: (keys: string[]) => set({ selectedRowKeys: keys }),
      clearSelectedRowKeys: () => set({ selectedRowKeys: [] }),

      // ── CRUD ───────────────────────────────────────────────────────────
      createOpportunity: async (opportunityData) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsat oluşturuluyor...', 'Lütfen bekleyiniz...');
          const newOpportunity = await opportunityService.createOpportunity(opportunityData);
          set({ currentOpportunity: newOpportunity });
          clearState();
          return newOpportunity;
        } catch (error) {
          setState(StateType.Error, 'Fırsat oluşturulamadı', handleError(error));
          throw error;
        }
      },

      updateOpportunity: async (opportunityData: Partial<OpportunityDetailItem>) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsat güncelleniyor...', 'Lütfen bekleyiniz...');
          const updated = await opportunityService.updateOpportunity(opportunityData);
          set({ currentOpportunity: updated });
          clearState();
          return updated;
        } catch (error) {
          setState(StateType.Error, 'Fırsat güncellenemedi', handleError(error));
          throw error;
        }
      },

      deleteOpportunity: async (id: string) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsat siliniyor...', 'Lütfen bekleyiniz...');
          await opportunityService.deleteOpportunity({ ids: [id] });
          await get().fetchOpportunities();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Fırsat silinemedi', handleError(error));
          throw error;
        }
      },

      // ── Bulk Actions ───────────────────────────────────────────────────
      bulkDeleteOpportunities: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsatlar siliniyor...', 'Lütfen bekleyiniz...');
          await opportunityService.deleteOpportunity({ ids: selectedRowKeys });
          await get().fetchOpportunities();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Fırsatlar silinemedi', handleError(error));
        }
      },

      bulkActivateOpportunities: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsatlar etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await opportunityService.setStatusOpportunity({ ids: selectedRowKeys, isActive: true });
          await get().fetchOpportunities();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Fırsatlar etkinleştirilemedi', handleError(error));
        }
      },

      bulkDeactivateOpportunities: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsatlar pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await opportunityService.setStatusOpportunity({ ids: selectedRowKeys, isActive: false });
          await get().fetchOpportunities();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Fırsatlar pasifleştirilemedi', handleError(error));
        }
      },

      bulkAssignOpportunities: async (entity) => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsatlar atanıyor...', 'Lütfen bekleyiniz...');
          const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
          if (!ownerId) return;
          await opportunityService.assignOpportunity({ ids: selectedRowKeys, ownerId });
          await get().fetchOpportunities();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Fırsatlar atanamadı', handleError(error));
        }
      },

      // ── Row-level Actions ──────────────────────────────────────────────
      activateOpportunity: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsat etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await opportunityService.setStatusOpportunity({ ids: [id], isActive: true });
          await get().fetchOpportunities();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Fırsat etkinleştirilemedi', handleError(error));
        }
      },

      deactivateOpportunity: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsat pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await opportunityService.setStatusOpportunity({ ids: [id], isActive: false });
          await get().fetchOpportunities();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Fırsat pasifleştirilemedi', handleError(error));
        }
      },

      assignOpportunity: async (id: string, entity) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsat atanıyor...', 'Lütfen bekleyiniz...');
          const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
          if (!ownerId) return;
          await opportunityService.assignOpportunity({ ids: [id], ownerId });
          await get().fetchOpportunities();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Fırsat atanamadı', handleError(error));
        }
      },

      setCurrentOpportunity: (opportunity: OpportunityDetailItem | null) =>
        set({ currentOpportunity: opportunity }),
    }),
    { name: 'opportunity-store' }
  )
);

export default useOpportunityStore;