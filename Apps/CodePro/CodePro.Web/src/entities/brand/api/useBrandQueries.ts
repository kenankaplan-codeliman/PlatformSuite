import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { brandKeys } from '../../../shared/api/queryKeys';
import { brandDataSource } from './brandDataSource';
import type { BrandListFilter } from '../model/types';

export function useBrandQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? brandKeys.detail(id) : brandKeys.detail('none'),
    queryFn: () => brandDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseBrandListParams {
  pagination: PaginationRequest;
  filters: BrandListFilter;
}

export function useBrandListQuery(params: UseBrandListParams) {
  return useQuery({
    queryKey: brandKeys.list(params),
    queryFn: () => brandDataSource.list(params),
  });
}
