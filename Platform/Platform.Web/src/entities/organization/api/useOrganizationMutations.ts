import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationKeys } from '../../../shared/api/queryKeys';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import type { AppError } from '../../../shared/types/ApiError';
import { organizationDataSource } from './organizationDataSource';
import type {
  AppOrganizationDetailItem,
  AppOrganizationFormValues,
} from '../model/types';

export function useUpsertOrganization() {
  const queryClient = useQueryClient();

  return useMutation<AppOrganizationDetailItem, AppError, AppOrganizationFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await organizationDataSource.create(values)
          : await organizationDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.setQueryData(organizationKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await organizationDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
    },
  });
}
