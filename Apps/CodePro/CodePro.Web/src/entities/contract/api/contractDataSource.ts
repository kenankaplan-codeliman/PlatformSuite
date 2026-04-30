import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  ContractDetailItem,
  ContractFormValues,
  ContractListFilter,
  ContractListItem,
} from '../model/types';

export const contractDataSource = {
  list: async (body: { pagination: PaginationRequest; filters: ContractListFilter }) =>
    (await httpClient.post<PagedResult<ContractListItem>>(CodeProServicePath.Contract.List, body)).data,
  get: async (id: string) =>
    (await httpClient.post<ContractDetailItem>(CodeProServicePath.Contract.Get, { id })).data,
  create: async (values: ContractFormValues) =>
    (await httpClient.post<ContractDetailItem>(CodeProServicePath.Contract.Create, values)).data,
  update: async (values: ContractFormValues) =>
    (await httpClient.post<ContractDetailItem>(CodeProServicePath.Contract.Update, values)).data,
  delete: async (id: string) => {
    await httpClient.post(CodeProServicePath.Contract.Delete, { id });
  },
};
