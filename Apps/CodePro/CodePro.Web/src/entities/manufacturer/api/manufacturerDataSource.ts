import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  ManufacturerDetailItem,
  ManufacturerFormValues,
  ManufacturerListFilter,
  ManufacturerListItem,
} from '../model/types';

interface ManufacturerListBody {
  pagination: PaginationRequest;
  filters: ManufacturerListFilter;
}

interface IdBody {
  id: string;
}

export const manufacturerDataSource = {
  list: async (body: ManufacturerListBody): Promise<PagedResult<ManufacturerListItem>> => {
    const response = await httpClient.post<PagedResult<ManufacturerListItem>>(
      CodeProServicePath.Manufacturer.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<ManufacturerDetailItem> => {
    const response = await httpClient.post<ManufacturerDetailItem>(
      CodeProServicePath.Manufacturer.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: ManufacturerFormValues): Promise<ManufacturerDetailItem> => {
    const response = await httpClient.post<ManufacturerDetailItem>(
      CodeProServicePath.Manufacturer.Create,
      values,
    );
    return response.data;
  },

  update: async (values: ManufacturerFormValues): Promise<ManufacturerDetailItem> => {
    const response = await httpClient.post<ManufacturerDetailItem>(
      CodeProServicePath.Manufacturer.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(CodeProServicePath.Manufacturer.Delete, { id } satisfies IdBody);
  },
};
