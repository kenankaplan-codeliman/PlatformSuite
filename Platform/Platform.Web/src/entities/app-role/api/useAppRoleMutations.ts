import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appRoleKeys } from '../../../shared/api/queryKeys';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import type { AppError } from '../../../shared/types/ApiError';
import { appRoleDataSource } from './appRoleDataSource';
import type {
  AppRoleDetailItem,
  AppRoleFormValues,
} from '../model/types';

export function useUpsertAppRole() {
  const queryClient = useQueryClient();

  return useMutation<AppRoleDetailItem, AppError, AppRoleFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await appRoleDataSource.create(values)
          : await appRoleDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: appRoleKeys.lists() });
      queryClient.setQueryData(appRoleKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteAppRole() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await appRoleDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appRoleKeys.all });
    },
  });
}
