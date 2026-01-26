import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ActivityBase,
  ActivityListFilters,
  ActivityStatusValue,
  ActivityTypeValue,
} from '@/types/activity.types';
import activityService from '@/services/activity.service';

// View Mode Type
export type ActivityViewMode = 'list' | 'calendar';

interface ActivityState {
  // View state
  viewMode: ActivityViewMode;

  // List state
  activities: ActivityBase[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: ActivityListFilters;
  selectedRowKeys: string[];

  // Calendar state
  calendarActivities: ActivityBase[];
  calendarLoading: boolean;
  calendarDate: Date;

  // Detail state
  currentActivity: ActivityBase | null;
  detailLoading: boolean;
  detailError: string | null;

  // Actions
  setViewMode: (mode: ActivityViewMode) => void;
  fetchActivities: () => Promise<void>;
  fetchCalendarActivities: (startDate: string, endDate: string) => Promise<void>;
  fetchActivityById: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
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
  clearError: () => void;
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
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      error: null,
      filters: initialFilters,
      selectedRowKeys: [],
      calendarActivities: [],
      calendarLoading: false,
      calendarDate: new Date(),
      currentActivity: null,
      detailLoading: false,
      detailError: null,

      // Set view mode
      setViewMode: (mode: ActivityViewMode) => {
        set({ viewMode: mode });
      },

      // Fetch activities list
      fetchActivities: async () => {
        const { page, pageSize, filters } = get();
        set({ loading: true, error: null });

        try {
          const response = await activityService.getActivities(page, pageSize, filters);
          set({
            activities: response.data,
            total: response.total,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Aktivite listesi yüklenirken hata oluştu',
            loading: false,
          });
        }
      },

      // Fetch activities for calendar
      fetchCalendarActivities: async (startDate: string, endDate: string) => {
        const { filters } = get();
        set({ calendarLoading: true });

        try {
          const activities = await activityService.getActivitiesForCalendar(
            startDate,
            endDate,
            filters
          );
          set({
            calendarActivities: activities,
            calendarLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Takvim aktiviteleri yüklenirken hata oluştu',
            calendarLoading: false,
          });
        }
      },

      // Fetch single activity
      fetchActivityById: async (id: string) => {
        set({ detailLoading: true, detailError: null });

        try {
          const activity = await activityService.getActivityById(id);
          set({
            currentActivity: activity,
            detailLoading: false,
          });
        } catch (error) {
          set({
            detailError:
              error instanceof Error ? error.message : 'Aktivite detayı yüklenirken hata oluştu',
            detailLoading: false,
          });
        }
      },

      // Pagination
      setPage: (page: number) => {
        set({ page });
        get().fetchActivities();
      },

      setPageSize: (pageSize: number) => {
        set({ pageSize, page: 1 });
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
      createActivity: async <T extends ActivityBase>(activityData: Omit<T, 'id' | 'createdAt' | 'createdBy'>) => {
        set({ loading: true, error: null });
        try {
          const newActivity = await activityService.createActivity<T>(activityData);
          await get().fetchActivities();
          return newActivity;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Aktivite oluşturulurken hata oluştu',
            loading: false,
          });
          throw error;
        }
      },

      updateActivity: async <T extends ActivityBase>(id: string, activityData: Partial<T>) => {
        set({ detailLoading: true, detailError: null });
        try {
          const updatedActivity = await activityService.updateActivity<T>(id, activityData);
          set({ currentActivity: updatedActivity, detailLoading: false });
          return updatedActivity;
        } catch (error) {
          set({
            detailError:
              error instanceof Error ? error.message : 'Aktivite güncellenirken hata oluştu',
            detailLoading: false,
          });
          throw error;
        }
      },

      deleteActivity: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await activityService.deleteActivity(id);
          await get().fetchActivities();
          get().clearSelectedRowKeys();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Aktivite silinirken hata oluştu',
            loading: false,
          });
          throw error;
        }
      },

      bulkDeleteActivities: async () => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;

        set({ loading: true, error: null });
        try {
          await activityService.bulkDeleteActivities(selectedRowKeys);
          await get().fetchActivities();
          get().clearSelectedRowKeys();
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Aktiviteler silinirken hata oluştu",
            loading: false,
          });
          throw error;
        }
      },

      bulkUpdateStatus: async (status: ActivityStatusValue) => {
        const { selectedRowKeys } = get();
        if (selectedRowKeys.length === 0) return;

        set({ loading: true, error: null });
        try {
          await activityService.bulkUpdateStatus(selectedRowKeys, status);
          await get().fetchActivities();
          get().clearSelectedRowKeys();
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Aktivite durumları güncellenirken hata oluştu',
            loading: false,
          });
          throw error;
        }
      },

      completeActivity: async (id: string) => {
        try {
          await activityService.completeActivity(id);
          await get().fetchActivities();
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Aktivite tamamlanırken hata oluştu',
          });
          throw error;
        }
      },

      cancelActivity: async (id: string) => {
        try {
          await activityService.cancelActivity(id);
          await get().fetchActivities();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Aktivite iptal edilirken hata oluştu',
          });
          throw error;
        }
      },

      setCurrentActivity: (activity: ActivityBase | null) => {
        set({ currentActivity: activity });
      },

      clearError: () => {
        set({ error: null, detailError: null });
      },
    }),
    { name: 'activity-store' }
  )
);

export default useActivityStore;