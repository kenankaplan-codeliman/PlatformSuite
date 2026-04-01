import leadService from '@/services/lead.service';
import type { LeadListItem, LeadDetailItem, LeadListFilters, LeadStatusValue } from '@/types/lead.types';
import { createEntityStore } from './entity.store.factory';

const _store = createEntityStore<LeadListItem, LeadDetailItem, LeadListFilters, LeadStatusValue>({
  storeName: 'lead-store',
  defaultPageSize: 10,
  initialFilters: {
    companyName: undefined,
    leadStatus: undefined,
    leadRating: undefined,
    leadSource: undefined,
    industry: undefined,
    isActive: undefined,
  },
  labels: { singular: 'Lead', plural: 'Leadler' },
  service: {
    getList: (page, pageSize, filters) => leadService.getLeads(page, pageSize, filters),
    getById: (id) => leadService.getLeadById(id),
    create: (data) => leadService.createLead(data as Omit<Partial<LeadDetailItem>, 'id' | 'createdAt' | 'updatedAt'>),
    update: (data) => leadService.updateLead(data as Partial<LeadDetailItem>),
    delete: (payload) => leadService.deleteLead(payload),
    setStatus: (payload) => leadService.setStatusLead(payload),
    assign: (payload) => leadService.assignLead(payload),
    updateStatus: (ids, status) => leadService.updateLeadStatus(ids, status),
  },
});

// ─── Wrapper hook — entity-specific aliases (backward compatible) ─────────────

export function useLeadStore() {
  const s = _store();
  return {
    ...s,
    leads: s.items as LeadListItem[],
    currentLead: s.currentItem as LeadDetailItem | null,
    setCurrentLead: s.setCurrentItem,
    fetchLeads: s.fetchItems,
    fetchLeadById: s.fetchItemById,
    createLead: s.createItem as (data: Omit<Partial<LeadDetailItem>, 'id' | 'createdAt' | 'updatedAt'>) => Promise<LeadDetailItem>,
    updateLead: s.updateItem as (data: Partial<LeadDetailItem>) => Promise<LeadDetailItem>,
    deleteLead: s.deleteItem,
    bulkDeleteLeads: s.bulkDelete,
    bulkActivateLeads: s.bulkActivate,
    bulkDeactivateLeads: s.bulkDeactivate,
    bulkAssignLeads: s.bulkAssign,
    bulkUpdateStatus: s.bulkUpdateStatus,
    activateLead: s.activateItem,
    deactivateLead: s.deactivateItem,
    assignLead: s.assignItem,
  };
}

useLeadStore.getState = _store.getState;

export default useLeadStore;
