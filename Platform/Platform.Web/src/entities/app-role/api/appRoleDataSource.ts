import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import type { PagedResult, PaginationRequest } from '../../../shared/types/Pagination';
import type {
  AppRoleDetailItem,
  AppRoleFormValues,
  AppRoleListFilter,
  AppRoleListItem,
} from '../model/types';

interface AppRoleListBody {
  pagination: PaginationRequest;
  filters: AppRoleListFilter;
}

interface IdBody {
  id: string;
}

export const appRoleDataSource = {
  list: async (body: AppRoleListBody): Promise<PagedResult<AppRoleListItem>> => {
    const response = await httpClient.post<PagedResult<AppRoleListItem>>(
      ServicePath.AppRole.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<AppRoleDetailItem> => {
    const response = await httpClient.post<AppRoleDetailItem>(
      ServicePath.AppRole.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: AppRoleFormValues): Promise<AppRoleDetailItem> => {
    const response = await httpClient.post<AppRoleDetailItem>(
      ServicePath.AppRole.Create,
      values,
    );
    return response.data;
  },

  update: async (values: AppRoleFormValues): Promise<AppRoleDetailItem> => {
    const response = await httpClient.post<AppRoleDetailItem>(
      ServicePath.AppRole.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(ServicePath.AppRole.Delete, { id } satisfies IdBody);
  },
};
