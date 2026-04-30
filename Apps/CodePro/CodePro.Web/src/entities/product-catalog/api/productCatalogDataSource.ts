import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  ProductCatalogDetailItem,
  ProductCatalogFormValues,
  ProductCatalogListFilter,
  ProductCatalogListItem,
} from '../model/types';

interface ProductCatalogListBody {
  pagination: PaginationRequest;
  filters: ProductCatalogListFilter;
}

interface IdBody {
  id: string;
}

export const productCatalogDataSource = {
  list: async (body: ProductCatalogListBody): Promise<PagedResult<ProductCatalogListItem>> => {
    const response = await httpClient.post<PagedResult<ProductCatalogListItem>>(
      CodeProServicePath.ProductCatalog.List,
      body,
    );
    return response.data;
  },
  get: async (id: string): Promise<ProductCatalogDetailItem> => {
    const response = await httpClient.post<ProductCatalogDetailItem>(
      CodeProServicePath.ProductCatalog.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },
  create: async (values: ProductCatalogFormValues): Promise<ProductCatalogDetailItem> => {
    const response = await httpClient.post<ProductCatalogDetailItem>(
      CodeProServicePath.ProductCatalog.Create,
      values,
    );
    return response.data;
  },
  update: async (values: ProductCatalogFormValues): Promise<ProductCatalogDetailItem> => {
    const response = await httpClient.post<ProductCatalogDetailItem>(
      CodeProServicePath.ProductCatalog.Update,
      values,
    );
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await httpClient.post(CodeProServicePath.ProductCatalog.Delete, { id } satisfies IdBody);
  },
};
