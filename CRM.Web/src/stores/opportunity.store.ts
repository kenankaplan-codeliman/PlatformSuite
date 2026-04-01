import opportunityService from '@/services/opportunity.service';
import type { OpportunityListItem, OpportunityDetailItem, OpportunityListFilters, OpportunityStageValue } from '@/types/opportunity.types';
import { createEntityStore } from './entity.store.factory';

const _store = createEntityStore<OpportunityListItem, OpportunityDetailItem, OpportunityListFilters, OpportunityStageValue>({
  storeName: 'opportunity-store',
  defaultPageSize: 50,
  initialFilters: {
    name: undefined,
    stage: undefined,
    accountId: undefined,
    source: undefined,
    isActive: undefined,
  },
  labels: { singular: 'Fırsat', plural: 'Fırsatlar' },
  service: {
    getList: (page, pageSize, filters) => opportunityService.getOpportunities(page, pageSize, filters),
    getById: (id) => opportunityService.getOpportunityById(id),
    create: (data) => opportunityService.createOpportunity(data as Omit<Partial<OpportunityDetailItem>, 'id' | 'createdAt' | 'updatedAt'>),
    update: (data) => opportunityService.updateOpportunity(data as Partial<OpportunityDetailItem>),
    delete: (payload) => opportunityService.deleteOpportunity(payload),
    setStatus: (payload) => opportunityService.setStatusOpportunity(payload),
    assign: (payload) => opportunityService.assignOpportunity(payload),
    updateStatus: (ids, stage) => opportunityService.updateOpportunityStage(ids, stage),
  },
});

// ─── Wrapper hook — entity-specific aliases (backward compatible) ─────────────

export function useOpportunityStore() {
  const s = _store();
  return {
    ...s,
    opportunities: s.items as OpportunityListItem[],
    currentOpportunity: s.currentItem as OpportunityDetailItem | null,
    setCurrentOpportunity: s.setCurrentItem,
    fetchOpportunities: s.fetchItems,
    fetchOpportunityById: s.fetchItemById,
    createOpportunity: s.createItem as (data: Omit<Partial<OpportunityDetailItem>, 'id' | 'createdAt' | 'updatedAt'>) => Promise<OpportunityDetailItem>,
    updateOpportunity: s.updateItem as (data: Partial<OpportunityDetailItem>) => Promise<OpportunityDetailItem>,
    deleteOpportunity: s.deleteItem,
    bulkDeleteOpportunities: s.bulkDelete,
    bulkActivateOpportunities: s.bulkActivate,
    bulkDeactivateOpportunities: s.bulkDeactivate,
    bulkAssignOpportunities: s.bulkAssign,
    bulkUpdateStage: s.bulkUpdateStatus,  // Fırsat'ta "stage" terminolojisi kullanılır
    activateOpportunity: s.activateItem,
    deactivateOpportunity: s.deactivateItem,
    assignOpportunity: s.assignItem,
  };
}

useOpportunityStore.getState = _store.getState;

export default useOpportunityStore;
