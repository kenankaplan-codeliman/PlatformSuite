import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { manufacturerKeys } from '../../../shared/api/queryKeys';
import { manufacturerDataSource } from './manufacturerDataSource';
import type { ManufacturerListFilter } from '../model/types';

export function useManufacturerQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? manufacturerKeys.detail(id) : manufacturerKeys.detail('none'),
    queryFn: () => manufacturerDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseManufacturerListParams {
  pagination: PaginationRequest;
  filters: ManufacturerListFilter;
}

export function useManufacturerListQuery(params: UseManufacturerListParams) {
  return useQuery({
    queryKey: manufacturerKeys.list(params),
    queryFn: () => manufacturerDataSource.list(params),
  });
}
