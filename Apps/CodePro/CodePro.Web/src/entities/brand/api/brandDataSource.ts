import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  BrandDetailItem,
  BrandFormValues,
  BrandListFilter,
  BrandListItem,
} from '../model/types';

interface BrandListBody {
  pagination: PaginationRequest;
  filters: BrandListFilter;
}

interface IdBody {
  id: string;
}

export const brandDataSource = {
  list: async (body: BrandListBody): Promise<PagedResult<BrandListItem>> => {
    const response = await httpClient.post<PagedResult<BrandListItem>>(
      CodeProServicePath.Brand.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<BrandDetailItem> => {
    const response = await httpClient.post<BrandDetailItem>(
      CodeProServicePath.Brand.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: BrandFormValues): Promise<BrandDetailItem> => {
    const response = await httpClient.post<BrandDetailItem>(
      CodeProServicePath.Brand.Create,
      values,
    );
    return response.data;
  },

  update: async (values: BrandFormValues): Promise<BrandDetailItem> => {
    const response = await httpClient.post<BrandDetailItem>(
      CodeProServicePath.Brand.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(CodeProServicePath.Brand.Delete, { id } satisfies IdBody);
  },
};
