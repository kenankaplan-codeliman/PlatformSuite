import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  SupplierDetailItem,
  SupplierFormValues,
  SupplierListFilter,
  SupplierListItem,
} from '../model/types';

interface SupplierListBody {
  pagination: PaginationRequest;
  filters: SupplierListFilter;
}

interface IdBody {
  id: string;
}

export const supplierDataSource = {
  list: async (body: SupplierListBody): Promise<PagedResult<SupplierListItem>> => {
    const response = await httpClient.post<PagedResult<SupplierListItem>>(
      CodeProServicePath.Supplier.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<SupplierDetailItem> => {
    const response = await httpClient.post<SupplierDetailItem>(
      CodeProServicePath.Supplier.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: SupplierFormValues): Promise<SupplierDetailItem> => {
    const response = await httpClient.post<SupplierDetailItem>(
      CodeProServicePath.Supplier.Create,
      values,
    );
    return response.data;
  },

  update: async (values: SupplierFormValues): Promise<SupplierDetailItem> => {
    const response = await httpClient.post<SupplierDetailItem>(
      CodeProServicePath.Supplier.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(CodeProServicePath.Supplier.Delete, { id } satisfies IdBody);
  },
};
