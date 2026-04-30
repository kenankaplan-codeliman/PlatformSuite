import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  ProductDetailItem,
  ProductFormValues,
  ProductListFilter,
  ProductListItem,
} from '../model/types';

interface ProductListBody {
  pagination: PaginationRequest;
  filters: ProductListFilter;
}

interface IdBody {
  id: string;
}

export const productDataSource = {
  list: async (body: ProductListBody): Promise<PagedResult<ProductListItem>> => {
    const response = await httpClient.post<PagedResult<ProductListItem>>(
      CodeProServicePath.Product.List,
      body,
    );
    return response.data;
  },
  get: async (id: string): Promise<ProductDetailItem> => {
    const response = await httpClient.post<ProductDetailItem>(
      CodeProServicePath.Product.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },
  create: async (values: ProductFormValues): Promise<ProductDetailItem> => {
    const response = await httpClient.post<ProductDetailItem>(
      CodeProServicePath.Product.Create,
      values,
    );
    return response.data;
  },
  update: async (values: ProductFormValues): Promise<ProductDetailItem> => {
    const response = await httpClient.post<ProductDetailItem>(
      CodeProServicePath.Product.Update,
      values,
    );
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await httpClient.post(CodeProServicePath.Product.Delete, { id } satisfies IdBody);
  },
};
