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
import { apiRequest } from '@/services/api.request';
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

  getActivities: async (page = 1, pageSize = 10, filters?: ActivityListFilters): Promise<ActivityListResponse> => {
    const request: ActivityListRequest = { page, pageSize, filters };
    return apiRequest(() => apiClient.post<ActivityListResponse>(ServicePath.Activity.List, request).then(r => r.data));
  },

  getActivitiesForCalendar: async (startDate: string, endDate: string, filters?: ActivityListFilters): Promise<ActivityListItem[]> => {
    const request: ActivityCalendarRequest = { startDate, endDate, filters };
    return apiRequest(() => apiClient.post<ActivityListItem[]>(ServicePath.Activity.Calendar, request).then(r => r.data));
  },

  getActivityById: async (id: string, activityType: ActivityTypeValue): Promise<ActivityBase> => {
    const request: ActivityRequest = { id };
    const endpoint = activityGetEndpointMap[activityType];
    return apiRequest(() => apiClient.post<ActivityBase>(endpoint, request).then(r => r.data));
  },

  createActivity: async <T extends ActivityBase>(activity: Omit<T, 'id' | 'createdAt' | 'createdBy'>): Promise<T> => {
    const endpoint = activityCreateEndpointMap[activity.activityType];
    return apiRequest(() => apiClient.post<T>(endpoint, activity).then(r => r.data));
  },

  updateActivity: async <T extends ActivityBase>(activity: Partial<T> & { activityType: T['activityType'] }): Promise<T> => {
    const endpoint = activityUpdateEndpointMap[activity.activityType];
    return apiRequest(() => apiClient.post<T>(endpoint, activity).then(r => r.data));
  },

  deleteActivity: async (request: IdListRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Activity.Delete, request).then(() => undefined));
  },

  setStatusActivity: async (request: StatusRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Activity.State, request).then(() => undefined));
  },

  assignActivity: async (request: AssignRequest): Promise<void> => {
    return apiRequest(() => apiClient.post(ServicePath.Activity.Assign, request).then(() => undefined));
  },

  bulkUpdateStatus: async (ids: string[], status: ActivityStatusValue): Promise<void> => {
    const request: ActivityBulkUpdateStatusRequest = { ids, status };
    return apiRequest(() => apiClient.post(ServicePath.Activity.BulkUpdateStatus, request).then(() => undefined));
  },

  completeActivity: async (id: string): Promise<ActivityBase> => {
    const request: ActivityRequest = { id };
    return apiRequest(() => apiClient.post<ActivityBase>(ServicePath.Activity.Complete, request).then(r => r.data));
  },

  cancelActivity: async (id: string): Promise<ActivityBase> => {
    const request: ActivityRequest = { id };
    return apiRequest(() => apiClient.post<ActivityBase>(ServicePath.Activity.Cancel, request).then(r => r.data));
  },
};

export default activityService;
