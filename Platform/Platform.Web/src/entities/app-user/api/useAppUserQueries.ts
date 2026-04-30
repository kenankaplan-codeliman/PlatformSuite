import { useQuery } from '@tanstack/react-query';
import { appUserKeys } from '../../../shared/api/queryKeys';
import type { PaginationRequest } from '../../../shared/types/Pagination';
import { appUserDataSource } from './appUserDataSource';
import type { AppUserListFilter } from '../model/types';

export function useAppUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? appUserKeys.detail(id) : appUserKeys.detail('none'),
    queryFn: () => appUserDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseAppUserListParams {
  pagination: PaginationRequest;
  filters: AppUserListFilter;
}

export function useAppUserListQuery(params: UseAppUserListParams) {
  return useQuery({
    queryKey: appUserKeys.list(params),
    queryFn: () => appUserDataSource.list(params),
  });
}
