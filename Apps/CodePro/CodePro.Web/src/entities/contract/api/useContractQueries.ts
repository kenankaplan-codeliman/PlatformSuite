import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { contractKeys } from '../../../shared/api/queryKeys';
import { contractDataSource } from './contractDataSource';
import type { ContractListFilter } from '../model/types';

export function useContractQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? contractKeys.detail(id) : contractKeys.detail('none'),
    queryFn: () => contractDataSource.get(id!),
    enabled: !!id,
  });
}

export function useContractListQuery(params: { pagination: PaginationRequest; filters: ContractListFilter }) {
  return useQuery({ queryKey: contractKeys.list(params), queryFn: () => contractDataSource.list(params) });
}
