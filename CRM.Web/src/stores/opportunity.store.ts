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
  assignOpportunity:(opportunityId: string, userId: string) => Promise<void>;
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
  bulkDeleteOpportunities: () => Promise<void>;
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
      // Initial state
      opportunities: [],
      hasMore: false,
      page: 1,
      pageSize: 50,       
      filters: initialFilters,
      selectedRowKeys: [],
      currentOpportunity: null,

      fetchOpportunities: async () => {
        const { page, pageSize, filters } = get();
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Fırsatlar yükleniyor...', 'Lütfen bekleyiniz...');
          const response = await opportunityService.getOpportunities(page, pageSize, filters);
          set({ opportunities: response.data, hasMore: response.hasMore });
          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Fırsatlar yüklenemedi', errorMessage);
        }
      },

      assignOpportunity: async(opportunityId: string, userId: string) => {
         const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Fırsat detayı yükleniyor...', 'Lütfen bekleyiniz...');
          await opportunityService.assignOpportunity(opportunityId, userId);
          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Fırsat detayı yüklenemedi', errorMessage);
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
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Fırsat detayı yüklenemedi', errorMessage);
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
        get().fetchOpportunities();
      },

      setFilters: (filters: OpportunityListFilters) => {
        set({ filters, page: 1 });
        get().fetchOpportunities();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchOpportunities();
      },

      setSelectedRowKeys: (keys: string[]) => set({ selectedRowKeys: keys }),
      clearSelectedRowKeys: () => set({ selectedRowKeys: [] }),

      createOpportunity: async (opportunityData) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsat oluşturuluyor...', 'Lütfen bekleyiniz...');
          const newOpportunity = await opportunityService.createOpportunity(opportunityData);
          set({ currentOpportunity: newOpportunity });
          clearState();
          return newOpportunity;
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Fırsat oluşturulamadı', errorMessage);
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
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Fırsat güncellenemedi', errorMessage);
          throw error;
        }
      },

      deleteOpportunity: async (id: string) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsat siliniyor...', 'Lütfen bekleyiniz...');
          await opportunityService.deleteOpportunity(id);
          await get().fetchOpportunities();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Fırsat silinemedi', errorMessage);
          throw error;
        }
      },

      bulkDeleteOpportunities: async () => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Fırsatlar siliniyor...', 'Lütfen bekleyiniz...');
          await opportunityService.bulkDeleteOpportunities(selectedRowKeys);
          await get().fetchOpportunities();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Fırsatlar silinemedi', errorMessage);
        }
      },

      setCurrentOpportunity: (opportunity: OpportunityDetailItem | null) => {
        set({ currentOpportunity: opportunity });
      },
    }),
    { name: 'opportunity-store' }
  )
);

export default useOpportunityStore;
