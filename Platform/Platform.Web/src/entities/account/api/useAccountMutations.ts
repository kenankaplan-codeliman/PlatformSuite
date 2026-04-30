import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountDataSource } from './accountDataSource';
import { accountKeys } from '../../../shared/api/queryKeys';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import type { AppError } from '../../../shared/types/ApiError';
import type { AccountDetailItem, AccountFormValues } from '../model/types';

/** Hem create hem update için tek hook — Id boşsa create, doluysa update. */
export function useUpsertAccount() {
  const queryClient = useQueryClient();

  return useMutation<AccountDetailItem, AppError, AccountFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await accountDataSource.create(values)
          : await accountDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.setQueryData(accountKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string[]>({
    mutationFn: async (ids) => {
      try {
        await accountDataSource.deleteMany(ids);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
