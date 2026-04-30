import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  PriceListDetailItem,
  PriceListFormValues,
  PriceListListFilter,
  PriceListListItem,
} from '../model/types';

interface PriceListListBody {
  pagination: PaginationRequest;
  filters: PriceListListFilter;
}

interface IdBody {
  id: string;
}

export const priceListDataSource = {
  list: async (body: PriceListListBody): Promise<PagedResult<PriceListListItem>> => {
    const response = await httpClient.post<PagedResult<PriceListListItem>>(
      CodeProServicePath.PriceList.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<PriceListDetailItem> => {
    const response = await httpClient.post<PriceListDetailItem>(
      CodeProServicePath.PriceList.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: PriceListFormValues): Promise<PriceListDetailItem> => {
    const response = await httpClient.post<PriceListDetailItem>(
      CodeProServicePath.PriceList.Create,
      values,
    );
    return response.data;
  },

  update: async (values: PriceListFormValues): Promise<PriceListDetailItem> => {
    const response = await httpClient.post<PriceListDetailItem>(
      CodeProServicePath.PriceList.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(CodeProServicePath.PriceList.Delete, { id } satisfies IdBody);
  },
};
