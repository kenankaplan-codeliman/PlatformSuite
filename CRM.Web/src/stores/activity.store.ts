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
import type { PaginationParams } from '@/types/common.types';
import type { EntityReference } from '@/types/entity.lookup.types';

export type ActivityViewMode = 'list' | 'calendar';

interface ActivityState {
  // View state
  viewMode: ActivityViewMode;

  // List state
  activities: ActivityListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
  filters: ActivityListFilters;
  selectedRowKeys: string[];

  // Calendar state
  calendarActivities: ActivityListItem[];
  calendarDate: Date;

  // Detail state
  currentActivity: ActivityBase | null;

  // Actions
  setViewMode: (mode: ActivityViewMode) => void;
  fetchActivities: () => Promise<void>;
  fetchCalendarActivities: (startDate: string, endDate: string) => Promise<void>;
  fetchActivityById: (id: string, activityType: ActivityTypeValue) => Promise<void>;
  setPagination: (params: PaginationParams) => void;
  setFilters: (filters: ActivityListFilters) => void;
  resetFilters: () => void;
  setSelectedRowKeys: (keys: string[]) => void;
  clearSelectedRowKeys: () => void;
  setCalendarDate: (date: Date) => void;
  createActivity: <T extends ActivityBase>(
    activity: Omit<T, 'id' | 'createdAt' | 'createdBy'>
  ) => Promise<T>;
  updateActivity: <T extends ActivityBase>(
    activity: Partial<T> & { activityType: T['activityType'] }
  ) => Promise<T>;
  deleteActivity: (id: string) => Promise<void>;

  // Bulk actions
  bulkDeleteActivities: () => Promise<void>;
  bulkActivateActivities: () => Promise<void>;
  bulkDeactivateActivities: () => Promise<void>;
  bulkUpdateStatus: (status: ActivityStatusValue) => Promise<void>;
  bulkAssignActivities: (entity: EntityReference | EntityReference[] | null) => Promise<void>;

  // Row-level actions
  activateActivity: (id: string) => Promise<void>;
  deactivateActivity: (id: string) => Promise<void>;
  assignActivity: (id: string, entity: EntityReference | EntityReference[] | null) => Promise<void>;
  completeActivity: (id: string) => Promise<void>;
  cancelActivity: (id: string) => Promise<void>;

  setCurrentActivity: (activity: ActivityBase | null) => void;
}

const initialFilters: ActivityListFilters = {
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
};

export const useActivityStore = create<ActivityState>()(
  devtools(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────
      viewMode: 'list',
      activities: [],
      hasMore: false,
      page: 1,
      pageSize: 10,
      filters: initialFilters,
      selectedRowKeys: [],
      calendarActivities: [],
      calendarDate: new Date(),
      currentActivity: null,

      // ── View mode ──────────────────────────────────────────────────────
      setViewMode: (mode: ActivityViewMode) => set({ viewMode: mode }),

      // ── Fetch ──────────────────────────────────────────────────────────
      fetchActivities: async () => {
        const { page, pageSize, filters } = get();
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite listesi yükleniyor...', 'Lütfen bekleyiniz...');
          const response = await activityService.getActivities(page, pageSize, filters);
          set({
            activities: response.data,
            hasMore: response.hasMore ?? (response.data.length === pageSize),
          });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite listesi yüklenemedi', handleError(error));
        }
      },

      fetchCalendarActivities: async (startDate: string, endDate: string) => {
        const { filters } = get();
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Takvim aktiviteleri yükleniyor...', 'Lütfen bekleyiniz...');
          const response = await activityService.getActivitiesForCalendar(
            startDate,
            endDate,
            filters
          );
          set({ calendarActivities: response });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Takvim aktiviteleri yüklenemedi', handleError(error));
        }
      },

      fetchActivityById: async (id: string, activityType: ActivityTypeValue) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite detayı yükleniyor...', 'Lütfen bekleyiniz...');
          const activity = await activityService.getActivityById(id, activityType);
          set({ currentActivity: activity });
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite detayı yüklenemedi', handleError(error));
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
        get().fetchActivities();
      },

      // ── Calendar date ──────────────────────────────────────────────────
      setCalendarDate: (date: Date) => set({ calendarDate: date }),

      // ── Filters ────────────────────────────────────────────────────────
      setFilters: (filters: ActivityListFilters) => {
        set({ filters, page: 1 });
        get().fetchActivities();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchActivities();
      },

      // ── Selection ──────────────────────────────────────────────────────
      setSelectedRowKeys: (keys: string[]) => set({ selectedRowKeys: keys }),
      clearSelectedRowKeys: () => set({ selectedRowKeys: [] }),

      // ── CRUD ───────────────────────────────────────────────────────────
      createActivity: async <T extends ActivityBase>(
        activityData: Omit<T, 'id' | 'createdAt' | 'createdBy'>
      ) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite oluşturuluyor...', 'Lütfen bekleyiniz...');
          const newActivity = await activityService.createActivity<T>(activityData);
          set({ currentActivity: newActivity });
          clearState();
          return newActivity;
        } catch (error) {
          setState(StateType.Error, 'Aktivite oluşturulamadı', handleError(error));
          throw error;
        }
      },

      updateActivity: async <T extends ActivityBase>(
        activityData: Partial<T> & { activityType: T['activityType'] }
      ) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite güncelleniyor...', 'Lütfen bekleyiniz...');
          const updated = await activityService.updateActivity<T>(activityData);
          set({ currentActivity: updated });
          clearState();
          return updated;
        } catch (error) {
          setState(StateType.Error, 'Aktivite güncellenemedi', handleError(error));
          throw error;
        }
      },

      deleteActivity: async (id: string) => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite siliniyor...', 'Lütfen bekleyiniz...');
          await activityService.deleteActivity({ ids: [id] });
          await get().fetchActivities();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Aktivite silinemedi', handleError(error));
          throw error;
        }
      },

      // ── Bulk Actions ───────────────────────────────────────────────────
      bulkDeleteActivities: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktiviteler siliniyor...', 'Lütfen bekleyiniz...');
          await activityService.deleteActivity({ ids: selectedRowKeys });
          await get().fetchActivities();
          get().clearSelectedRowKeys();
        } catch (error) {
          setState(StateType.Error, 'Aktiviteler silinemedi', handleError(error));
        }
      },

      bulkActivateActivities: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktiviteler etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await activityService.setStatusActivity({ ids: selectedRowKeys, isActive: true });
          await get().fetchActivities();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktiviteler etkinleştirilemedi', handleError(error));
        }
      },

      bulkDeactivateActivities: async () => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktiviteler pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await activityService.setStatusActivity({ ids: selectedRowKeys, isActive: false });
          await get().fetchActivities();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktiviteler pasifleştirilemedi', handleError(error));
        }
      },

      // Aktiviteye özgü: toplu durum güncelleme
      bulkUpdateStatus: async (status: ActivityStatusValue) => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktiviteler güncelleniyor...', 'Lütfen bekleyiniz...');
          await activityService.bulkUpdateStatus(selectedRowKeys, status);
          await get().fetchActivities();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktiviteler güncellenemedi', handleError(error));
        }
      },

      bulkAssignActivities: async (entity) => {
        const { selectedRowKeys } = get();
        if (!selectedRowKeys.length) return;
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktiviteler atanıyor...', 'Lütfen bekleyiniz...');
          const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
          if (!ownerId) return;
          await activityService.assignActivity({ ids: selectedRowKeys, ownerId });
          await get().fetchActivities();
          get().clearSelectedRowKeys();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktiviteler atanamadı', handleError(error));
        }
      },

      // ── Row-level Actions ──────────────────────────────────────────────
      activateActivity: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite etkinleştiriliyor...', 'Lütfen bekleyiniz...');
          await activityService.setStatusActivity({ ids: [id], isActive: true });
          await get().fetchActivities();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite etkinleştirilemedi', handleError(error));
        }
      },

      deactivateActivity: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite pasifleştiriliyor...', 'Lütfen bekleyiniz...');
          await activityService.setStatusActivity({ ids: [id], isActive: false });
          await get().fetchActivities();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite pasifleştirilemedi', handleError(error));
        }
      },

      assignActivity: async (id: string, entity) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite atanıyor...', 'Lütfen bekleyiniz...');
          const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
          if (!ownerId) return;
          await activityService.assignActivity({ ids: [id], ownerId });
          await get().fetchActivities();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite atanamadı', handleError(error));
        }
      },

      completeActivity: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite tamamlanıyor...', 'Lütfen bekleyiniz...');
          const updated = await activityService.completeActivity(id);
          set({ currentActivity: updated });
          await get().fetchActivities();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite tamamlanamadı', handleError(error));
          throw error;
        }
      },

      cancelActivity: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktivite iptal ediliyor...', 'Lütfen bekleyiniz...');
          const updated = await activityService.cancelActivity(id);
          set({ currentActivity: updated });
          await get().fetchActivities();
          clearState();
        } catch (error) {
          setState(StateType.Error, 'Aktivite iptal edilemedi', handleError(error));
          throw error;
        }
      },

      setCurrentActivity: (activity: ActivityBase | null) => set({ currentActivity: activity }),
    }),
    { name: 'activity-store' }
  )
);

export default useActivityStore;