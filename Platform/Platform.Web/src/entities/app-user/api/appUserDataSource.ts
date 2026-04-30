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
      values,
    );
    return response.data;
  },

  update: async (values: AppUserFormValues): Promise<AppUserDetailItem> => {
    const response = await httpClient.post<AppUserDetailItem>(
      ServicePath.User.Update,
      values,
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
