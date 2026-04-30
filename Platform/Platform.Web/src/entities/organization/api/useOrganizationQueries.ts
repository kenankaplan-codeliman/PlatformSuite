import { useQuery } from '@tanstack/react-query';
import { organizationKeys } from '../../../shared/api/queryKeys';
import type { PaginationRequest } from '../../../shared/types/Pagination';
import { organizationDataSource } from './organizationDataSource';
import type { AppOrganizationListFilter } from '../model/types';

export function useOrganizationQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? organizationKeys.detail(id) : organizationKeys.detail('none'),
    queryFn: () => organizationDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseOrganizationListParams {
  pagination: PaginationRequest;
  filters: AppOrganizationListFilter;
}

export function useOrganizationListQuery(params: UseOrganizationListParams) {
  return useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => organizationDataSource.list(params),
  });
}
