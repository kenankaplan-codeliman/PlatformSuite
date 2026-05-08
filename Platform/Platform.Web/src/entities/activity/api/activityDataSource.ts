import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import type { PagedResult, PaginationRequest } from '../../../shared/types/Pagination';
import type {
  ActivityListFilter,
  ActivityListItem,
  ActivityType,
  AppointmentActivityDetail,
  AppointmentFormValues,
  EmailActivityDetail,
  EmailFormValues,
  PhoneCallActivityDetail,
  PhoneCallFormValues,
  TaskActivityDetail,
  TaskFormValues,
} from '../model/types';

interface ListBody {
  pagination: PaginationRequest;
  filters: ActivityListFilter;
}

interface IdBody { id: string }
interface IdListBody { ids: string[] }

const getEndpoints: Record<ActivityType, string> = {
  PhoneCall: ServicePath.Activity.GetPhoneCall,
  Task: ServicePath.Activity.GetTask,
  Appointment: ServicePath.Activity.GetAppointment,
  Email: ServicePath.Activity.GetEmail,
};

const createEndpoints: Record<ActivityType, string> = {
  PhoneCall: ServicePath.Activity.CreatePhoneCall,
  Task: ServicePath.Activity.CreateTask,
  Appointment: ServicePath.Activity.CreateAppointment,
  Email: ServicePath.Activity.CreateEmail,
};

const updateEndpoints: Record<ActivityType, string> = {
  PhoneCall: ServicePath.Activity.UpdatePhoneCall,
  Task: ServicePath.Activity.UpdateTask,
  Appointment: ServicePath.Activity.UpdateAppointment,
  Email: ServicePath.Activity.UpdateEmail,
};

export const activityDataSource = {
  list: async (body: ListBody): Promise<PagedResult<ActivityListItem>> => {
    const response = await httpClient.post<PagedResult<ActivityListItem>>(
      ServicePath.Activity.List,
      body,
    );
    return response.data;
  },

  getPhoneCall: async (id: string): Promise<PhoneCallActivityDetail> => {
    const r = await httpClient.post<PhoneCallActivityDetail>(getEndpoints.PhoneCall, { id } satisfies IdBody);
    return r.data;
  },
  getTask: async (id: string): Promise<TaskActivityDetail> => {
    const r = await httpClient.post<TaskActivityDetail>(getEndpoints.Task, { id } satisfies IdBody);
    return r.data;
  },
  getAppointment: async (id: string): Promise<AppointmentActivityDetail> => {
    const r = await httpClient.post<AppointmentActivityDetail>(getEndpoints.Appointment, { id } satisfies IdBody);
    return r.data;
  },
  getEmail: async (id: string): Promise<EmailActivityDetail> => {
    const r = await httpClient.post<EmailActivityDetail>(getEndpoints.Email, { id } satisfies IdBody);
    return r.data;
  },

  upsertPhoneCall: async (values: PhoneCallFormValues): Promise<PhoneCallActivityDetail> => {
    const isNew = !values.id || values.id === '';
    const url = isNew ? createEndpoints.PhoneCall : updateEndpoints.PhoneCall;
    const r = await httpClient.post<PhoneCallActivityDetail>(url, values);
    return r.data;
  },
  upsertTask: async (values: TaskFormValues): Promise<TaskActivityDetail> => {
    const isNew = !values.id || values.id === '';
    const url = isNew ? createEndpoints.Task : updateEndpoints.Task;
    const r = await httpClient.post<TaskActivityDetail>(url, values);
    return r.data;
  },
  upsertAppointment: async (values: AppointmentFormValues): Promise<AppointmentActivityDetail> => {
    const isNew = !values.id || values.id === '';
    const url = isNew ? createEndpoints.Appointment : updateEndpoints.Appointment;
    const r = await httpClient.post<AppointmentActivityDetail>(url, values);
    return r.data;
  },
  upsertEmail: async (values: EmailFormValues): Promise<EmailActivityDetail> => {
    const isNew = !values.id || values.id === '';
    const url = isNew ? createEndpoints.Email : updateEndpoints.Email;
    const r = await httpClient.post<EmailActivityDetail>(url, values);
    return r.data;
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await httpClient.post(ServicePath.Activity.Delete, { ids } satisfies IdListBody);
  },

  complete: async (id: string): Promise<void> => {
    await httpClient.post(ServicePath.Activity.Complete, { id } satisfies IdBody);
  },

  cancel: async (id: string): Promise<void> => {
    await httpClient.post(ServicePath.Activity.Cancel, { id } satisfies IdBody);
  },

  setState: async (ids: string[], isActive: boolean): Promise<void> => {
    await httpClient.post(ServicePath.Activity.SetState, { ids, isActive });
  },

  assign: async (ids: string[], ownerId: string): Promise<void> => {
    await httpClient.post(ServicePath.Activity.Assign, { ids, ownerId });
  },
};
