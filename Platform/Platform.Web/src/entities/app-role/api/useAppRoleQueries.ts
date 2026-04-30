import { useQuery } from '@tanstack/react-query';
import { appRoleKeys } from '../../../shared/api/queryKeys';
import type { PaginationRequest } from '../../../shared/types/Pagination';
import { appRoleDataSource } from './appRoleDataSource';
import type { AppRoleListFilter } from '../model/types';

export function useAppRoleQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? appRoleKeys.detail(id) : appRoleKeys.detail('none'),
    queryFn: () => appRoleDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseAppRoleListParams {
  pagination: PaginationRequest;
  filters: AppRoleListFilter;
}

export function useAppRoleListQuery(params: UseAppRoleListParams) {
  return useQuery({
    queryKey: appRoleKeys.list(params),
    queryFn: () => appRoleDataSource.list(params),
  });
}
