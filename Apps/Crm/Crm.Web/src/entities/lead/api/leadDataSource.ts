import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CrmServicePath } from '../../../shared/api/servicePaths';
import type {
  ConvertLeadInput,
  ConvertLeadResult,
  LeadDetailItem,
  LeadFormValues,
  LeadListFilter,
  LeadListItem,
} from '../model/types';

interface LeadListBody {
  pagination: PaginationRequest;
  filters: LeadListFilter;
}

interface IdBody {
  id: string;
}

export const leadDataSource = {
  list: async (body: LeadListBody): Promise<PagedResult<LeadListItem>> => {
    const response = await httpClient.post<PagedResult<LeadListItem>>(
      CrmServicePath.Lead.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<LeadDetailItem> => {
    const response = await httpClient.post<LeadDetailItem>(
      CrmServicePath.Lead.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: LeadFormValues): Promise<LeadDetailItem> => {
    const response = await httpClient.post<LeadDetailItem>(
      CrmServicePath.Lead.Create,
      values,
    );
    return response.data;
  },

  update: async (values: LeadFormValues): Promise<LeadDetailItem> => {
    const response = await httpClient.post<LeadDetailItem>(
      CrmServicePath.Lead.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(CrmServicePath.Lead.Delete, { id } satisfies IdBody);
  },

  convert: async (input: ConvertLeadInput): Promise<ConvertLeadResult> => {
    const response = await httpClient.post<ConvertLeadResult>(
      CrmServicePath.Lead.Convert,
      input,
    );
    return response.data;
  },
};
