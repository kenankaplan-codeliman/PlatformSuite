import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { opportunityKeys } from '../../../shared/api/queryKeys';
import { opportunityDataSource } from './opportunityDataSource';
import type { OpportunityDetailItem, OpportunityFormValues } from '../model/types';

export function useUpsertOpportunity() {
  const queryClient = useQueryClient();

  return useMutation<OpportunityDetailItem, AppError, OpportunityFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await opportunityDataSource.create(values)
          : await opportunityDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() });
      queryClient.setQueryData(opportunityKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteOpportunity() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await opportunityDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
    },
  });
}
