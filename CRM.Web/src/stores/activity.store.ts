import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ActivityBase,
  ActivityListFilters,
  ActivityListItem,
  ActivityStatusValue,
  ActivityTypeValue,
} from '@/types/activity.types';
import activityService from '@/services/activity.service';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';
import { createEntityStore } from './entity.store.factory';

export type ActivityViewMode = 'list' | 'calendar';

// ─── Base store (common CRUD via factory) ─────────────────────────────────────

const _baseStore = createEntityStore<ActivityListItem, ActivityBase, ActivityListFilters>({
  storeName: 'activity-store',
  defaultPageSize: 10,
  initialFilters: {
    subject: undefined,
    activityType: undefined,
    status: undefined,
    priority: undefined,
    regardingEntityType: undefined,
    regardingEntityId: undefined,
    dueDateFrom: undefined,
    dueDateTo: undefined,
    ownerId: undefined,
    isActive: undefined,
  },
  labels: { singular: 'Aktivite', plural: 'Aktiviteler' },
  service: {
    getList: (page, pageSize, filters) => activityService.getActivities(page, pageSize, filters).then(
      (r) => ({ data: r.data, hasMore: r.hasMore ?? (r.data.length === pageSize) })
    ),
    getById: (id) => activityService.getActivityById(id as string, '' as ActivityTypeValue),
    create: (data) => activityService.createActivity(data as Parameters<typeof activityService.createActivity>[0]),
    update: (data) => activityService.updateActivity(data as Parameters<typeof activityService.updateActivity>[0]),
    delete: (payload) => activityService.deleteActivity(payload),
    setStatus: (payload) => activityService.setStatusActivity(payload),
    assign: (payload) => activityService.assignActivity(payload),
  },
});

// ─── Activity-specific extended store (calendar + status actions) ─────────────

interface ActivityExtendedState {
  viewMode: ActivityViewMode;
  calendarActivities: ActivityListItem[];
  calendarDate: Date;

  setViewMode(mode: ActivityViewMode): void;
  fetchCalendarActivities(startDate: string, endDate: string): Promise<void>;
  setCalendarDate(date: Date): void;
  fetchActivityById(id: string, activityType: ActivityTypeValue): Promise<void>;
  createActivity<T extends ActivityBase>(activity: Omit<T, 'id' | 'createdAt' | 'createdBy'>): Promise<T>;
  updateActivity<T extends ActivityBase>(activity: Partial<T> & { activityType: T['activityType'] }): Promise<T>;
  deleteActivity(id: string): Promise<void>;
  bulkUpdateStatus(status: ActivityStatusValue): Promise<void>;
  completeActivity(id: string): Promise<void>;
  cancelActivity(id: string): Promise<void>;
  setCurrentActivity(activity: ActivityBase | null): void;
}

const _extendedStore = create<ActivityExtendedState>()(
  devtools(
    (set) => ({
      viewMode: 'list',
      calendarActivities: [],
      calendarDate: new Date(),

      setViewMode: (mode) => set({ viewMode: mode }),
      setCalendarDate: (date) => set({ calendarDate: date }),
      setCurrentActivity: (activity) => _baseStore.getState().setCurrentItem(activity),

      fetchCalendarActivities: async (startDate, endDate) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Takvim aktiviteleri yükleniyor...', 'Lütfen bekleyiniz...');
          const { filters } = _baseStore.getState();
          const response = await activityService.getActivitiesForCalendar(startDate, endDate, filters);
          set({ calendarActivities: response });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Takvim aktiviteleri yüklenemedi', handleError(error));
        }
      },

      fetchActivityById: async (id, activityType) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite detayı yükleniyor...', 'Lütfen bekleyiniz...');
          const activity = await activityService.getActivityById(id, activityType);
          _baseStore.getState().setCurrentItem(activity);
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite detayı yüklenemedi', handleError(error));
        }
      },

      createActivity: async <T extends ActivityBase>(activityData: Omit<T, 'id' | 'createdAt' | 'createdBy'>) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite oluşturuluyor...', 'Lütfen bekleyiniz...');
          const newActivity = await activityService.createActivity<T>(activityData);
          _baseStore.getState().setCurrentItem(newActivity);
          clearState();
          return newActivity;
        } catch (error) {
          setState(StateType.Error, 'Aktivite oluşturulamadı', handleError(error));
          throw error;
        }
      },

      updateActivity: async <T extends ActivityBase>(activityData: Partial<T> & { activityType: T['activityType'] }) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite güncelleniyor...', 'Lütfen bekleyiniz...');
          const updated = await activityService.updateActivity<T>(activityData);
          _baseStore.getState().setCurrentItem(updated);
          clearState();
          return updated;
        } catch (error) {
          setState(StateType.Error, 'Aktivite güncellenemedi', handleError(error));
          throw error;
        }
      },

      deleteActivity: async (id) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite siliniyor...', 'Lütfen bekleyiniz...');
          await activityService.deleteActivity({ ids: [id] });
          await _baseStore.getState().fetchItems();
          _baseStore.getState().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Aktivite silinemedi', handleError(error));
          throw error;
        }
      },

      bulkUpdateStatus: async (status) => {
        const { selectedRowKeys, fetchItems, clearSelectedRowKeys } = _baseStore.getState();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktiviteler güncelleniyor...', 'Lütfen bekleyiniz...');
          await activityService.bulkUpdateStatus(selectedRowKeys, status);
          await fetchItems();
          clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktiviteler güncellenemedi', handleError(error));
        }
      },

      completeActivity: async (id) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite tamamlanıyor...', 'Lütfen bekleyiniz...');
          const updated = await activityService.completeActivity(id);
          _baseStore.getState().setCurrentItem(updated);
          await _baseStore.getState().fetchItems();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite tamamlanamadı', handleError(error));
          throw error;
        }
      },

      cancelActivity: async (id) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite iptal ediliyor...', 'Lütfen bekleyiniz...');
          const updated = await activityService.cancelActivity(id);
          _baseStore.getState().setCurrentItem(updated);
          await _baseStore.getState().fetchItems();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite iptal edilemedi', handleError(error));
          throw error;
        }
      },
    }),
    { name: 'activity-store-extended' }
  )
);

// ─── Wrapper hook — merges base + extended (backward compatible) ──────────────

export function useActivityStore() {
  const base = _baseStore();
  const ext = _extendedStore();

  return {
    // Base (generic → entity-specific aliases)
    ...base,
    activities: base.items as ActivityListItem[],
    currentActivity: base.currentItem as ActivityBase | null,
    fetchActivities: base.fetchItems,
    setPagination: base.setPagination,
    setFilters: base.setFilters,
    resetFilters: base.resetFilters,
    setSelectedRowKeys: base.setSelectedRowKeys,
    clearSelectedRowKeys: base.clearSelectedRowKeys,
    bulkDeleteActivities: base.bulkDelete,
    bulkActivateActivities: base.bulkActivate,
    bulkDeactivateActivities: base.bulkDeactivate,
    bulkAssignActivities: base.bulkAssign,
    activateActivity: base.activateItem,
    deactivateActivity: base.deactivateItem,
    assignActivity: base.assignItem,

    // Extended (activity-specific)
    viewMode: ext.viewMode,
    calendarActivities: ext.calendarActivities,
    calendarDate: ext.calendarDate,
    setViewMode: ext.setViewMode,
    setCalendarDate: ext.setCalendarDate,
    setCurrentActivity: ext.setCurrentActivity,
    fetchCalendarActivities: ext.fetchCalendarActivities,
    fetchActivityById: ext.fetchActivityById,
    createActivity: ext.createActivity,
    updateActivity: ext.updateActivity,
    deleteActivity: ext.deleteActivity,
    bulkUpdateStatus: ext.bulkUpdateStatus,
    completeActivity: ext.completeActivity,
    cancelActivity: ext.cancelActivity,
  };
}

useActivityStore.getState = () => ({
  ..._baseStore.getState(),
  ..._extendedStore.getState(),
});

export default useActivityStore;
