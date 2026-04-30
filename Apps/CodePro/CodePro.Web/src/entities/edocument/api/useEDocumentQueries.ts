import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { eDocumentKeys } from '../../../shared/api/queryKeys';
import { eDocumentDataSource } from './eDocumentDataSource';
import type { EDocumentListFilter } from '../model/types';

export function useEDocumentQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? eDocumentKeys.detail(id) : eDocumentKeys.detail('none'),
    queryFn: () => eDocumentDataSource.get(id!),
    enabled: !!id,
  });
}

export function useEDocumentListQuery(params: { pagination: PaginationRequest; filters: EDocumentListFilter }) {
  return useQuery({ queryKey: eDocumentKeys.list(params), queryFn: () => eDocumentDataSource.list(params) });
}
