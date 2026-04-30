import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { brandKeys } from '../../../shared/api/queryKeys';
import { brandDataSource } from './brandDataSource';
import type { BrandDetailItem, BrandFormValues } from '../model/types';

export function useUpsertBrand() {
  const queryClient = useQueryClient();

  return useMutation<BrandDetailItem, AppError, BrandFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await brandDataSource.create(values)
          : await brandDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.setQueryData(brandKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await brandDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
}
