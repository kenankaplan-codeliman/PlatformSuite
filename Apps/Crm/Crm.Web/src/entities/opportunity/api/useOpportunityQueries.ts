import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { opportunityKeys } from '../../../shared/api/queryKeys';
import { opportunityDataSource } from './opportunityDataSource';
import type { OpportunityListFilter } from '../model/types';

export function useOpportunityQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? opportunityKeys.detail(id) : opportunityKeys.detail('none'),
    queryFn: () => opportunityDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseOpportunityListParams {
  pagination: PaginationRequest;
  filters: OpportunityListFilter;
}

export function useOpportunityListQuery(params: UseOpportunityListParams) {
  return useQuery({
    queryKey: opportunityKeys.list(params),
    queryFn: () => opportunityDataSource.list(params),
  });
}
