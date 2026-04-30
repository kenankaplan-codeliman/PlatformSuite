import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { contractKeys } from '../../../shared/api/queryKeys';
import { contractDataSource } from './contractDataSource';
import type { ContractDetailItem, ContractFormValues } from '../model/types';

export function useUpsertContract() {
  const qc = useQueryClient();
  return useMutation<ContractDetailItem, AppError, ContractFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew ? await contractDataSource.create(values) : await contractDataSource.update(values);
      } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: contractKeys.lists() });
      qc.setQueryData(contractKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteContract() {
  const qc = useQueryClient();
  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try { await contractDataSource.delete(id); } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contractKeys.all }),
  });
}
