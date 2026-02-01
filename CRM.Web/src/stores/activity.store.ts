import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ActivityBase,
  ActivityListFilters,
  ActivityStatusValue,
  ActivityTypeValue,
} from '@/types/activity.types';
import activityService from '@/services/activity.service';
import { handleError } from '@/util/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';

// View Mode Type
export type ActivityViewMode = 'list' | 'calendar';

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface ActivityState {
  // View state
  viewMode: ActivityViewMode;

  // List state
  activities: ActivityBase[];
  hasMore: boolean;
  page: number;
  pageSize: number;
  filters: ActivityListFilters;
  selectedRowKeys: string[];

  // Calendar state
  calendarActivities: ActivityBase[];
  calendarDate: Date;

  // Detail state
  currentActivity: ActivityBase | null;

  // Actions
  setViewMode: (mode: ActivityViewMode) => void;
  fetchActivities: () => Promise<void>;
  fetchCalendarActivities: (startDate: string, endDate: string) => Promise<void>;
  fetchActivityById: (id: string) => Promise<void>;
  setPagination: (params: PaginationParams) => void;
  setFilters: (filters: ActivityListFilters) => void;
  resetFilters: () => void;
  setSelectedRowKeys: (keys: string[]) => void;
  clearSelectedRowKeys: () => void;
  setCalendarDate: (date: Date) => void;
  createActivity: <T extends ActivityBase>(
    activity: Omit<T, 'id' | 'createdAt' | 'createdBy'>
  ) => Promise<T>;
  updateActivity: <T extends ActivityBase>(id: string, activity: Partial<T>) => Promise<T>;
  deleteActivity: (id: string) => Promise<void>;
  bulkDeleteActivities: () => Promise<void>;
  bulkUpdateStatus: (status: ActivityStatusValue) => Promise<void>;
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
      // Initial state
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

      // Set view mode
      setViewMode: (mode: ActivityViewMode) => {
        set({ viewMode: mode });
      },

      // Fetch activities list
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
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Aktivite listesi yüklenemedi', errorMessage);
        }
      },

      // Fetch activities for calendar
      fetchCalendarActivities: async (startDate: string, endDate: string) => {
        const { filters } = get();
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Takvim aktiviteleri yükleniyor...', 'Lütfen bekleyiniz...');

          const activities = await activityService.getActivitiesForCalendar(
            startDate,
            endDate,
            filters
          );
          set({
            calendarActivities: activities,
          });

          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Takvim aktiviteleri yüklenemedi', errorMessage);
        }
      },

      // Fetch single activity
      fetchActivityById: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Aktivite detayı yükleniyor...', 'Lütfen bekleyiniz...');

          const activity = await activityService.getActivityById(id);
          set({
            currentActivity: activity,
          });

          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Aktivite detayı yüklenemedi', errorMessage);
        }
      },

      // Pagination - tek metod ile page ve pageSize güncelleme (Lead store ile aynı)
      setPagination: (params: PaginationParams) => {
        const currentState = get();
        const newPage = params.page ?? currentState.page;
        const newPageSize = params.pageSize ?? currentState.pageSize;

        // pageSize değiştiyse sayfa 1'e dön
        const finalPage =
          params.pageSize !== undefined && params.pageSize !== currentState.pageSize
            ? 1
            : newPage;

        set({
          page: finalPage,
          pageSize: newPageSize,
        });

        // Tek bir fetchActivities çağrısı
        get().fetchActivities();
      },

      // Calendar date
      setCalendarDate: (date: Date) => {
        set({ calendarDate: date });
      },

      // Filters
      setFilters: (filters: ActivityListFilters) => {
        set({ filters, page: 1 });
        get().fetchActivities();
      },

      resetFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().fetchActivities();
      },

      // Selection
      setSelectedRowKeys: (keys: string[]) => {
        set({ selectedRowKeys: keys });
      },

      clearSelectedRowKeys: () => {
        set({ selectedRowKeys: [] });
      },

      // CRUD operations
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
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Aktivite oluşturulamadı', errorMessage);
          throw error;
        }
      },

      updateActivity: async <T extends ActivityBase>(id: string, activityData: Partial<T>) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Aktivite güncelleniyor...', 'Lütfen bekleyiniz...');
          const updatedActivity = await activityService.updateActivity<T>(id, activityData);
          set({ currentActivity: updatedActivity });
          clearState();
          return updatedActivity;
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Aktivite güncellenemedi', errorMessage);
          throw error;
        }
      },

      deleteActivity: async (id: string) => {
        const { setState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Aktivite siliniyor...', 'Lütfen bekleyiniz...');
          await activityService.deleteActivity(id);
          await get().fetchActivities();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Aktivite silinemedi', errorMessage);
          throw error;
        }
      },

      bulkDeleteActivities: async () => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;

        const { setState } = useProcessState.getState();

        try {
          setState(StateType.Loading, "Aktiviteler siliniyor...", 'Lütfen bekleyiniz...');
          await activityService.bulkDeleteActivities(selectedRowKeys);
          await get().fetchActivities();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Aktiviteler silinemedi", errorMessage);
        }
      },

      bulkUpdateStatus: async (status: ActivityStatusValue) => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;

        const { setState } = useProcessState.getState();

        try {
          setState(StateType.Loading, "Aktiviteler güncelleniyor...", 'Lütfen bekleyiniz...');
          await activityService.bulkUpdateStatus(selectedRowKeys, status);
          await get().fetchActivities();
          get().clearSelectedRowKeys();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Aktiviteler güncellenemedi", errorMessage);
          throw error;
        }
      },

      completeActivity: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Aktivite tamamlanıyor...', 'Lütfen bekleyiniz...');
          const updatedActivity = await activityService.completeActivity(id);
          set({ currentActivity: updatedActivity });
          await get().fetchActivities();
          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Aktivite tamamlanamadı', errorMessage);
          throw error;
        }
      },

      cancelActivity: async (id: string) => {
        const { setState, clearState } = useProcessState.getState();

        try {
          setState(StateType.Loading, 'Aktivite iptal ediliyor...', 'Lütfen bekleyiniz...');
          const updatedActivity = await activityService.cancelActivity(id);
          set({ currentActivity: updatedActivity });
          await get().fetchActivities();
          clearState();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Aktivite iptal edilemedi', errorMessage);
          throw error;
        }
      },

      setCurrentActivity: (activity: ActivityBase | null) => {
        set({ currentActivity: activity });
      },
    }),
    { name: 'activity-store' }
  )
);

export default useActivityStore;
