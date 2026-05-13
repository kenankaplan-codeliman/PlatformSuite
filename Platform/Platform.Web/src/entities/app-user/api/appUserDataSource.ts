import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import type { PagedResult, PaginationRequest } from '../../../shared/types/Pagination';
import type {
  AppUserDetailItem,
  AppUserFormValues,
  AppUserListFilter,
  AppUserListItem,
} from '../model/types';

interface AppUserListBody {
  pagination: PaginationRequest;
  filters: AppUserListFilter;
}

interface IdBody {
  id: string;
}

/**
 * Form Organization/Manager (EntityReference) → Backend Command (flat IDs).
 * Form değeri EntityReference shape (popup'tan {id,name,entityType,...}); command
 * yalnızca <c>OrganizationId</c> ve <c>ManagerId</c> bekler.
 */
function toCommand(values: AppUserFormValues) {
  return {
    id: values.id,
    email: values.email,
    firstName: values.firstName,
    lastName: values.lastName,
    phoneNumber: values.phoneNumber,
    organizationId: values.organization?.id ?? '',
    managerId: values.manager?.id ?? null,
    isActive: values.isActive,
  };
}

export const appUserDataSource = {
  list: async (body: AppUserListBody): Promise<PagedResult<AppUserListItem>> => {
    const response = await httpClient.post<PagedResult<AppUserListItem>>(
      ServicePath.User.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<AppUserDetailItem> => {
    const response = await httpClient.post<AppUserDetailItem>(
      ServicePath.User.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: AppUserFormValues): Promise<AppUserDetailItem> => {
    const response = await httpClient.post<AppUserDetailItem>(
      ServicePath.User.Create,
      toCommand(values),
    );
    return response.data;
  },

  update: async (values: AppUserFormValues): Promise<AppUserDetailItem> => {
    const response = await httpClient.post<AppUserDetailItem>(
      ServicePath.User.Update,
      toCommand(values),
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(ServicePath.User.Delete, { id } satisfies IdBody);
  },

  updateRoles: async (userId: string, roleIds: string[]): Promise<void> => {
    await httpClient.post(ServicePath.User.UpdateRoles, { userId, roleIds });
  },

  changePassword: async (
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await httpClient.post(ServicePath.User.ChangePassword, {
      userId,
      currentPassword,
      newPassword,
    });
  },
};
