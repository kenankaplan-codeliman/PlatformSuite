import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { leadKeys } from '../../../shared/api/queryKeys';
import { leadDataSource } from './leadDataSource';
import type { LeadListFilter } from '../model/types';

export function useLeadQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? leadKeys.detail(id) : leadKeys.detail('none'),
    queryFn: () => leadDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseLeadListParams {
  pagination: PaginationRequest;
  filters: LeadListFilter;
}

export function useLeadListQuery(params: UseLeadListParams) {
  return useQuery({
    queryKey: leadKeys.list(params),
    queryFn: () => leadDataSource.list(params),
  });
}
