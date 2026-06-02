import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CrmServicePath } from '../../../shared/api/servicePaths';
import type {
  ProductDetailItem,
  ProductFormValues,
  ProductListFilter,
  ProductListItem,
  ProductLookupItem,
} from '../model/types';

interface ProductListBody {
  pagination: PaginationRequest;
  filters: ProductListFilter;
}

interface SearchBody {
  searchText?: string;
  pagination: PaginationRequest;
}

interface IdBody {
  id: string;
}

interface IdListBody {
  ids: string[];
}

export const productDataSource = {
  list: async (body: ProductListBody): Promise<PagedResult<ProductListItem>> => {
    const response = await httpClient.post<PagedResult<ProductListItem>>(
      CrmServicePath.Product.List,
      body,
    );
    return response.data;
  },

  search: async (body: SearchBody): Promise<PagedResult<ProductLookupItem>> => {
    const response = await httpClient.post<PagedResult<ProductLookupItem>>(
      CrmServicePath.Product.Search,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<ProductDetailItem> => {
    const response = await httpClient.post<ProductDetailItem>(
      CrmServicePath.Product.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: ProductFormValues): Promise<ProductDetailItem> => {
    const response = await httpClient.post<ProductDetailItem>(
      CrmServicePath.Product.Create,
      values,
    );
    return response.data;
  },

  update: async (values: ProductFormValues): Promise<ProductDetailItem> => {
    const response = await httpClient.post<ProductDetailItem>(
      CrmServicePath.Product.Update,
      values,
    );
    return response.data;
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await httpClient.post(CrmServicePath.Product.Delete, { ids } satisfies IdListBody);
  },

  setState: async (ids: string[], isActive: boolean): Promise<void> => {
    await httpClient.post(CrmServicePath.Product.SetState, { ids, isActive });
  },
};
