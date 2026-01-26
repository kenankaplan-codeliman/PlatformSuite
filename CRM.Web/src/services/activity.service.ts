import type {
  ActivityBase,
  ActivityListFilters,
  ActivityListResponse,
  ActivityTypeValue,
  ActivityStatusValue,
} from '@/types/activity.types';
import apiClient from '@/services/apiClient';

const ACTIVITY_API_BASE = '/activities';

export const activityService = {
  // Get paginated list of activities with optional filters
  getActivities: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: ActivityListFilters
  ): Promise<ActivityListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<ActivityListResponse>(
      `${ACTIVITY_API_BASE}?${params.toString()}`
    );
    return response.data;
  },

  // Get activities for calendar view (date range)
  getActivitiesForCalendar: async (
    startDate: string,
    endDate: string,
    filters?: ActivityListFilters
  ): Promise<ActivityBase[]> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<ActivityBase[]>(
      `${ACTIVITY_API_BASE}/calendar?${params.toString()}`
    );
    return response.data;
  },

  // Get single activity by ID
  getActivityById: async (id: string): Promise<ActivityBase> => {
    const response = await apiClient.get<ActivityBase>(`${ACTIVITY_API_BASE}/${id}`);
    return response.data;
  },

  // Create new activity
  createActivity: async <T extends ActivityBase>(
    activity: Omit<T, 'id' | 'createdAt' | 'createdBy'>
  ): Promise<T> => {
    const response = await apiClient.post<T>(ACTIVITY_API_BASE, activity);
    return response.data;
  },

  // Update existing activity
  updateActivity: async <T extends ActivityBase>(
    id: string,
    activity: Partial<T>
  ): Promise<T> => {
    const response = await apiClient.put<T>(`${ACTIVITY_API_BASE}/${id}`, activity);
    return response.data;
  },

  // Delete activity (soft delete)
  deleteActivity: async (id: string): Promise<void> => {
    await apiClient.delete(`${ACTIVITY_API_BASE}/${id}`);
  },

  // Bulk delete activities
  bulkDeleteActivities: async (ids: string[]): Promise<void> => {
    await apiClient.post(`${ACTIVITY_API_BASE}/bulk-delete`, { ids });
  },

  // Bulk update activity status
  bulkUpdateStatus: async (ids: string[], status: ActivityStatusValue): Promise<void> => {
    await apiClient.post(`${ACTIVITY_API_BASE}/bulk-update-status`, { ids, status });
  },

  // Mark activity as completed
  completeActivity: async (id: string): Promise<ActivityBase> => {
    const response = await apiClient.post<ActivityBase>(`${ACTIVITY_API_BASE}/${id}/complete`);
    return response.data;
  },

  // Cancel activity
  cancelActivity: async (id: string): Promise<ActivityBase> => {
    const response = await apiClient.post<ActivityBase>(`${ACTIVITY_API_BASE}/${id}/cancel`);
    return response.data;
  },

  // Get activities by regarding entity
  getActivitiesByRegarding: async (
    entityType: string,
    entityId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ActivityListResponse> => {
    const params = new URLSearchParams({
      regardingEntityType: entityType,
      regardingEntityId: entityId,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const response = await apiClient.get<ActivityListResponse>(
      `${ACTIVITY_API_BASE}?${params.toString()}`
    );
    return response.data;
  },

  // Export activities to Excel
  exportActivities: async (filters?: ActivityListFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`${ACTIVITY_API_BASE}/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default activityService;