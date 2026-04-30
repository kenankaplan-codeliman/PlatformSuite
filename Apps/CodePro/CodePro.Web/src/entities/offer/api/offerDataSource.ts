import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  OfferDetailItem,
  OfferFormValues,
  OfferListFilter,
  OfferListItem,
} from '../model/types';

export const offerDataSource = {
  list: async (body: { pagination: PaginationRequest; filters: OfferListFilter }) =>
    (await httpClient.post<PagedResult<OfferListItem>>(CodeProServicePath.Offer.List, body)).data,
  get: async (id: string) =>
    (await httpClient.post<OfferDetailItem>(CodeProServicePath.Offer.Get, { id })).data,
  create: async (values: OfferFormValues) =>
    (await httpClient.post<OfferDetailItem>(CodeProServicePath.Offer.Create, values)).data,
  update: async (values: OfferFormValues) =>
    (await httpClient.post<OfferDetailItem>(CodeProServicePath.Offer.Update, values)).data,
  delete: async (id: string) => {
    await httpClient.post(CodeProServicePath.Offer.Delete, { id });
  },
};
