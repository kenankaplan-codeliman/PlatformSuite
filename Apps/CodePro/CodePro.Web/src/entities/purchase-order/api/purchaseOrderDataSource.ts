import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  PurchaseOrderDetailItem,
  PurchaseOrderFormValues,
  PurchaseOrderListFilter,
  PurchaseOrderListItem,
} from '../model/types';

export const purchaseOrderDataSource = {
  list: async (body: { pagination: PaginationRequest; filters: PurchaseOrderListFilter }) =>
    (await httpClient.post<PagedResult<PurchaseOrderListItem>>(CodeProServicePath.PurchaseOrder.List, body)).data,
  get: async (id: string) =>
    (await httpClient.post<PurchaseOrderDetailItem>(CodeProServicePath.PurchaseOrder.Get, { id })).data,
  create: async (values: PurchaseOrderFormValues) =>
    (await httpClient.post<PurchaseOrderDetailItem>(CodeProServicePath.PurchaseOrder.Create, values)).data,
  update: async (values: PurchaseOrderFormValues) =>
    (await httpClient.post<PurchaseOrderDetailItem>(CodeProServicePath.PurchaseOrder.Update, values)).data,
  delete: async (id: string) => {
    await httpClient.post(CodeProServicePath.PurchaseOrder.Delete, { id });
  },
};
