import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  EDocumentDetailItem,
  EDocumentFormValues,
  EDocumentListFilter,
  EDocumentListItem,
} from '../model/types';

export const eDocumentDataSource = {
  list: async (body: { pagination: PaginationRequest; filters: EDocumentListFilter }) =>
    (await httpClient.post<PagedResult<EDocumentListItem>>(CodeProServicePath.EDocument.List, body)).data,
  get: async (id: string) =>
    (await httpClient.post<EDocumentDetailItem>(CodeProServicePath.EDocument.Get, { id })).data,
  create: async (values: EDocumentFormValues) =>
    (await httpClient.post<EDocumentDetailItem>(CodeProServicePath.EDocument.Create, values)).data,
  update: async (values: EDocumentFormValues) =>
    (await httpClient.post<EDocumentDetailItem>(CodeProServicePath.EDocument.Update, values)).data,
  delete: async (id: string) => {
    await httpClient.post(CodeProServicePath.EDocument.Delete, { id });
  },
};
