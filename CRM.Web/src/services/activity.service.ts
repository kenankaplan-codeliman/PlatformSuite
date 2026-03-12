import {
  type ActivityBase,
  type ActivityListFilters,
  type ActivityListResponse,
  type ActivityListRequest,
  type ActivityRequest,
  type ActivityBulkUpdateStatusRequest,
  type ActivityStatusValue,
  type ActivityCalendarRequest,
  ActivityType,
  type ActivityTypeValue,
  type ActivityListItem,
} from '@/types/activity.types';
import apiClient from '@/services/api.client';
import { ServicePath } from '@/config/service.paths';
import type { AssignRequest, IdListRequest, StatusRequest } from '@/types/common.types';

// ─── Endpoint Maps ────────────────────────────────────────────────────────────

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

// ─── Service ──────────────────────────────────────────────────────────────────

export const activityService = {

  getActivities: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: ActivityListFilters
  ): Promise<ActivityListResponse> => {
    const request: ActivityListRequest = { page, pageSize, filters };
    const response = await apiClient.post<ActivityListResponse>(
      ServicePath.Activity.List,
      request
    );
    return response.data;
  },

  getActivitiesForCalendar: async (
    startDate: string,
    endDate: string,
    filters?: ActivityListFilters
  ): Promise<ActivityListItem[]> => {
    const request: ActivityCalendarRequest = { startDate, endDate, filters };
    const response = await apiClient.post<ActivityListItem[]>(
      ServicePath.Activity.Calendar,
      request
    );
    return response.data;
  },

  getActivityById: async (id: string, activityType: ActivityTypeValue): Promise<ActivityBase> => {
    const request: ActivityRequest = { id };
    const endpoint = activityGetEndpointMap[activityType];
    const response = await apiClient.post<ActivityBase>(endpoint, request);
    return response.data;
  },

  createActivity: async <T extends ActivityBase>(
    activity: Omit<T, 'id' | 'createdAt' | 'createdBy'>
  ): Promise<T> => {
    const endpoint = activityCreateEndpointMap[activity.activityType];
    const response = await apiClient.post<T>(endpoint, activity);
    return response.data;
  },

  updateActivity: async <T extends ActivityBase>(
    activity: Partial<T> & { activityType: T['activityType'] }
  ): Promise<T> => {
    const endpoint = activityUpdateEndpointMap[activity.activityType];
    const response = await apiClient.post<T>(endpoint, activity);
    return response.data;
  },

  // Tekil ve bulk silme aynı endpoint — ids dizisiyle çalışır
  deleteActivity: async (request: IdListRequest): Promise<void> => {
    await apiClient.post(ServicePath.Activity.Delete, request);
  },

  setStatusActivity: async (request: StatusRequest): Promise<void> => {
    await apiClient.post(ServicePath.Activity.State, request);
  },

  assignActivity: async (request: AssignRequest): Promise<void> => {
    await apiClient.post(ServicePath.Activity.Assign, request);
  },

  // Aktiviteye özgü: durum güncelleme (Completed, Cancelled vb.)
  bulkUpdateStatus: async (ids: string[], status: ActivityStatusValue): Promise<void> => {
    const request: ActivityBulkUpdateStatusRequest = { ids, status };
    await apiClient.post(ServicePath.Activity.BulkUpdateStatus, request);
  },

  completeActivity: async (id: string): Promise<ActivityBase> => {
    const request: ActivityRequest = { id };
    const response = await apiClient.post<ActivityBase>(
      ServicePath.Activity.Complete,
      request
    );
    return response.data;
  },

  cancelActivity: async (id: string): Promise<ActivityBase> => {
    const request: ActivityRequest = { id };
    const response = await apiClient.post<ActivityBase>(
      ServicePath.Activity.Cancel,
      request
    );
    return response.data;
  },
};

export default activityService;