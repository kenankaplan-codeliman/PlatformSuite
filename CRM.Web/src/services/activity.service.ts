import {
  type ActivityBase,
  type ActivityListFilters,
  type ActivityListResponse,
  type ActivityListRequest,
  type ActivityGetRequest as ActivityRequest,
  type ActivityDeleteRequest,
  type ActivityBulkDeleteRequest,
  type ActivityBulkUpdateStatusRequest,
  type ActivityStatusValue,
  type ActivityCalendarRequest,
  ActivityType,
  type ActivityTypeValue,
  type ActivityListItem,
} from '@/types/activity.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/constants/service.paths';



const activityCreateEndpointMap: Record<ActivityTypeValue, string> = {
  [ActivityType.Email]: ServicePath.Activity.CreateEmail,
  [ActivityType.PhoneCall]: ServicePath.Activity.CreatePhoneCall,
  [ActivityType.Task]: ServicePath.Activity.CreateTask,
  [ActivityType.Appointment]: ServicePath.Activity.CreateAppointment,
};

const activityUpdateEndpointMap: Record<ActivityTypeValue, string> = {
  [ActivityType.Email]: ServicePath.Activity.UpdateEmail,
  [ActivityType.PhoneCall]: ServicePath.Activity.UpdatePhoneCall,
  [ActivityType.Task]: ServicePath.Activity.UpdateTask,
  [ActivityType.Appointment]: ServicePath.Activity.UpdateAppointment,
};

const activityGetEndpointMap: Record<ActivityTypeValue, string> = {
  [ActivityType.Email]: ServicePath.Activity.GetEmail,
  [ActivityType.PhoneCall]: ServicePath.Activity.GetPhoneCall,
  [ActivityType.Task]: ServicePath.Activity.GetTask,
  [ActivityType.Appointment]: ServicePath.Activity.GetAppointment,
};


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
  ): Promise<ActivityListItem[]> => {
    const request: ActivityCalendarRequest = {
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
  getActivityById: async (id: string, activityType: ActivityTypeValue): Promise<ActivityBase> => {
    const request: ActivityRequest = {
      id: id,
    };

    const endpoint = activityGetEndpointMap[activityType]

    const response = await apiClient.post<ActivityBase>(
      endpoint,
      request
    );
    return response.data;
  },

  // Create new activity
  createActivity: async <T extends ActivityBase>(
    activity: Omit<T, 'id' | 'createdAt' | 'createdBy'>
  ): Promise<T> => {

    const endpoint = activityCreateEndpointMap[activity.activityType];

    const response = await apiClient.post<T>(
      endpoint,
      activity
    );
    return response.data;
  },

  // Update existing activity
updateActivity: async <T extends ActivityBase>(
  activity: Partial<T> & { activityType: T['activityType'] }
): Promise<T> => {
  
  const endpoint = activityUpdateEndpointMap[activity.activityType];

  const response = await apiClient.post<T>(endpoint, activity);
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
