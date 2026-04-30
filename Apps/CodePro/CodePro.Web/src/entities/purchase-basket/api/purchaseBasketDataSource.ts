import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  PurchaseBasketDetailItem,
  PurchaseBasketFormValues,
  PurchaseBasketListFilter,
  PurchaseBasketListItem,
} from '../model/types';

export const purchaseBasketDataSource = {
  list: async (body: { pagination: PaginationRequest; filters: PurchaseBasketListFilter }) =>
    (await httpClient.post<PagedResult<PurchaseBasketListItem>>(CodeProServicePath.PurchaseBasket.List, body)).data,
  get: async (id: string) =>
    (await httpClient.post<PurchaseBasketDetailItem>(CodeProServicePath.PurchaseBasket.Get, { id })).data,
  create: async (values: PurchaseBasketFormValues) =>
    (await httpClient.post<PurchaseBasketDetailItem>(CodeProServicePath.PurchaseBasket.Create, values)).data,
  update: async (values: PurchaseBasketFormValues) =>
    (await httpClient.post<PurchaseBasketDetailItem>(CodeProServicePath.PurchaseBasket.Update, values)).data,
  delete: async (id: string) => {
    await httpClient.post(CodeProServicePath.PurchaseBasket.Delete, { id });
  },
};
