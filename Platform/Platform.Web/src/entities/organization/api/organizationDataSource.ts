import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import type { PagedResult, PaginationRequest } from '../../../shared/types/Pagination';
import type {
  AppOrganizationDetailItem,
  AppOrganizationFormValues,
  AppOrganizationListFilter,
  AppOrganizationListItem,
} from '../model/types';

interface OrganizationListBody {
  pagination: PaginationRequest;
  filters: AppOrganizationListFilter;
}

interface IdBody {
  id: string;
}

export const organizationDataSource = {
  list: async (body: OrganizationListBody): Promise<PagedResult<AppOrganizationListItem>> => {
    const response = await httpClient.post<PagedResult<AppOrganizationListItem>>(
      ServicePath.AppOrganization.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<AppOrganizationDetailItem> => {
    const response = await httpClient.post<AppOrganizationDetailItem>(
      ServicePath.AppOrganization.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: AppOrganizationFormValues): Promise<AppOrganizationDetailItem> => {
    const response = await httpClient.post<AppOrganizationDetailItem>(
      ServicePath.AppOrganization.Create,
      values,
    );
    return response.data;
  },

  update: async (values: AppOrganizationFormValues): Promise<AppOrganizationDetailItem> => {
    const response = await httpClient.post<AppOrganizationDetailItem>(
      ServicePath.AppOrganization.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(ServicePath.AppOrganization.Delete, { id } satisfies IdBody);
  },
};
