import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  ProductPriceDetailItem,
  ProductPriceFormValues,
  ProductPriceListFilter,
  ProductPriceListItem,
} from '../model/types';

interface ProductPriceListBody {
  pagination: PaginationRequest;
  filters: ProductPriceListFilter;
}

interface IdBody {
  id: string;
}

export const productPriceDataSource = {
  list: async (body: ProductPriceListBody): Promise<PagedResult<ProductPriceListItem>> => {
    const response = await httpClient.post<PagedResult<ProductPriceListItem>>(
      CodeProServicePath.ProductPrice.List,
      body,
    );
    return response.data;
  },
  get: async (id: string): Promise<ProductPriceDetailItem> => {
    const response = await httpClient.post<ProductPriceDetailItem>(
      CodeProServicePath.ProductPrice.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },
  create: async (values: ProductPriceFormValues): Promise<ProductPriceDetailItem> => {
    const response = await httpClient.post<ProductPriceDetailItem>(
      CodeProServicePath.ProductPrice.Create,
      values,
    );
    return response.data;
  },
  update: async (values: ProductPriceFormValues): Promise<ProductPriceDetailItem> => {
    const response = await httpClient.post<ProductPriceDetailItem>(
      CodeProServicePath.ProductPrice.Update,
      values,
    );
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await httpClient.post(CodeProServicePath.ProductPrice.Delete, { id } satisfies IdBody);
  },
};
