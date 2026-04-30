import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CrmServicePath } from '../../../shared/api/servicePaths';
import type {
  OpportunityDetailItem,
  OpportunityFormValues,
  OpportunityListFilter,
  OpportunityListItem,
} from '../model/types';

interface OpportunityListBody {
  pagination: PaginationRequest;
  filters: OpportunityListFilter;
}

interface IdBody {
  id: string;
}

export const opportunityDataSource = {
  list: async (body: OpportunityListBody): Promise<PagedResult<OpportunityListItem>> => {
    const response = await httpClient.post<PagedResult<OpportunityListItem>>(
      CrmServicePath.Opportunity.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<OpportunityDetailItem> => {
    const response = await httpClient.post<OpportunityDetailItem>(
      CrmServicePath.Opportunity.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: OpportunityFormValues): Promise<OpportunityDetailItem> => {
    const response = await httpClient.post<OpportunityDetailItem>(
      CrmServicePath.Opportunity.Create,
      values,
    );
    return response.data;
  },

  update: async (values: OpportunityFormValues): Promise<OpportunityDetailItem> => {
    const response = await httpClient.post<OpportunityDetailItem>(
      CrmServicePath.Opportunity.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(CrmServicePath.Opportunity.Delete, { id } satisfies IdBody);
  },
};
