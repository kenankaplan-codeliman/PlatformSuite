import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  PurchaseRequestDetailItem,
  PurchaseRequestFormValues,
  PurchaseRequestListFilter,
  PurchaseRequestListItem,
} from '../model/types';

export const purchaseRequestDataSource = {
  list: async (body: { pagination: PaginationRequest; filters: PurchaseRequestListFilter }) =>
    (await httpClient.post<PagedResult<PurchaseRequestListItem>>(
      CodeProServicePath.PurchaseRequest.List,
      body,
    )).data,
  get: async (id: string) =>
    (await httpClient.post<PurchaseRequestDetailItem>(
      CodeProServicePath.PurchaseRequest.Get,
      { id },
    )).data,
  create: async (values: PurchaseRequestFormValues) =>
    (await httpClient.post<PurchaseRequestDetailItem>(
      CodeProServicePath.PurchaseRequest.Create,
      values,
    )).data,
  update: async (values: PurchaseRequestFormValues) =>
    (await httpClient.post<PurchaseRequestDetailItem>(
      CodeProServicePath.PurchaseRequest.Update,
      values,
    )).data,
  delete: async (id: string) => {
    await httpClient.post(CodeProServicePath.PurchaseRequest.Delete, { id });
  },
};
