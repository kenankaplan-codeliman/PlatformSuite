import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { leadKeys } from '../../../shared/api/queryKeys';
import { leadDataSource } from './leadDataSource';
import type { LeadDetailItem, LeadFormValues } from '../model/types';

/** Hem create hem update için tek hook — Id boşsa create, doluysa update. */
export function useUpsertLead() {
  const queryClient = useQueryClient();

  return useMutation<LeadDetailItem, AppError, LeadFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await leadDataSource.create(values)
          : await leadDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.setQueryData(leadKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await leadDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
  });
}
