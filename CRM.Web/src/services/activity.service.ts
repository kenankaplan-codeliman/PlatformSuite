import type {
  ActivityBase,
  ActivityListFilters,
  ActivityListResponse,
  ActivityListRequest,
  ActivityGetRequest,
  ActivityUpdateRequest,
  ActivityDeleteRequest,
  ActivityBulkDeleteRequest,
  ActivityBulkUpdateStatusRequest,
  ActivityStatusValue,
} from '@/types/activity.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/constants/service.paths';

export const activityService = {
  // Get paginated list of activities with optional filters
  getActivities: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: ActivityListFilters
  ): Promise<ActivityListResponse> => {
    const request: ActivityListRequest = {
      page: page,
      pageSize: pageSize,
      filters: filters,
    };

    const response = await apiClient.post<ActivityListResponse>(
      ServicePath.Activity.List,
      request
    );

    return response.data;
  },

  // Get activities for calendar view (date range)
  getActivitiesForCalendar: async (
    startDate: string,
    endDate: string,
    filters?: ActivityListFilters
  ): Promise<ActivityBase[]> => {
    const request = {
      startDate,
      endDate,
      filters,
    };

    const response = await apiClient.post<ActivityBase[]>(
      ServicePath.Activity.Calendar,
      request
    );
    return response.data;
  },

  // Get single activity by ID
  getActivityById: async (id: string): Promise<ActivityBase> => {
    const request: ActivityGetRequest = {
      id: id,
    };

    const response = await apiClient.post<ActivityBase>(
      ServicePath.Activity.Get,
      request
    );
    return response.data;
  },

  // Create new activity
  createActivity: async <T extends ActivityBase>(
    activity: Omit<T, 'id' | 'createdAt' | 'createdBy'>
  ): Promise<T> => {
    const response = await apiClient.post<T>(
      ServicePath.Activity.Create,
      activity
    );
    return response.data;
  },

  // Update existing activity
  updateActivity: async <T extends ActivityBase>(
    id: string,
    activity: Partial<T>
  ): Promise<T> => {
    const request: ActivityUpdateRequest = {
      id: id,
      data: activity,
    };

    const response = await apiClient.post<T>(
      ServicePath.Activity.Update,
      request
    );
    return response.data;
  },

  // Delete activity (soft delete)
  deleteActivity: async (id: string): Promise<void> => {
    const request: ActivityDeleteRequest = {
      id: id,
    };

    await apiClient.post(ServicePath.Activity.Delete, request);
  },

  // Bulk delete activities
  bulkDeleteActivities: async (ids: string[]): Promise<void> => {
    const request: ActivityBulkDeleteRequest = {
      ids: ids,
    };

    await apiClient.post(ServicePath.Activity.BulkDelete, request);
  },

  // Bulk update activity status
  bulkUpdateStatus: async (ids: string[], status: ActivityStatusValue): Promise<void> => {
    const request: ActivityBulkUpdateStatusRequest = {
      ids: ids,
      status: status,
    };

    await apiClient.post(ServicePath.Activity.BulkUpdateStatus, request);
  },

  // Mark activity as completed
  completeActivity: async (id: string): Promise<ActivityBase> => {
    const request = { id };
    const response = await apiClient.post<ActivityBase>(
      ServicePath.Activity.Complete,
      request
    );
    return response.data;
  },

  // Cancel activity
  cancelActivity: async (id: string): Promise<ActivityBase> => {
    const request = { id };
    const response = await apiClient.post<ActivityBase>(
      ServicePath.Activity.Cancel,
      request
    );
    return response.data;
  },

  // Get activities by regarding entity
  getActivitiesByRegarding: async (
    entityType: string,
    entityId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ActivityListResponse> => {
    const request: ActivityListRequest = {
      page: page,
      pageSize: pageSize,
      filters: {
        regardingEntityType: entityType,
        regardingEntityId: entityId,
      },
    };

    const response = await apiClient.post<ActivityListResponse>(
      ServicePath.Activity.List,
      request
    );
    return response.data;
  },

  // Export activities to Excel
  exportActivities: async (filters?: ActivityListFilters): Promise<Blob> => {
    const request = { filters };

    const response = await apiClient.post(
      ServicePath.Activity.Export,
      request,
      { responseType: 'blob' }
    );
    return response.data;
  },
};

export default activityService;
