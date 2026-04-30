import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  ProductCategoryDetailItem,
  ProductCategoryFormValues,
  ProductCategoryListFilter,
  ProductCategoryListItem,
} from '../model/types';

interface ProductCategoryListBody {
  pagination: PaginationRequest;
  filters: ProductCategoryListFilter;
}

interface IdBody {
  id: string;
}

export const productCategoryDataSource = {
  list: async (
    body: ProductCategoryListBody,
  ): Promise<PagedResult<ProductCategoryListItem>> => {
    const response = await httpClient.post<PagedResult<ProductCategoryListItem>>(
      CodeProServicePath.ProductCategory.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<ProductCategoryDetailItem> => {
    const response = await httpClient.post<ProductCategoryDetailItem>(
      CodeProServicePath.ProductCategory.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (
    values: ProductCategoryFormValues,
  ): Promise<ProductCategoryDetailItem> => {
    const response = await httpClient.post<ProductCategoryDetailItem>(
      CodeProServicePath.ProductCategory.Create,
      values,
    );
    return response.data;
  },

  update: async (
    values: ProductCategoryFormValues,
  ): Promise<ProductCategoryDetailItem> => {
    const response = await httpClient.post<ProductCategoryDetailItem>(
      CodeProServicePath.ProductCategory.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(
      CodeProServicePath.ProductCategory.Delete,
      { id } satisfies IdBody,
    );
  },
};
