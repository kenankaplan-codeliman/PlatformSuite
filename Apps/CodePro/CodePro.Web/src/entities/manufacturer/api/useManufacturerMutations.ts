import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { manufacturerKeys } from '../../../shared/api/queryKeys';
import { manufacturerDataSource } from './manufacturerDataSource';
import type {
  ManufacturerDetailItem,
  ManufacturerFormValues,
} from '../model/types';

export function useUpsertManufacturer() {
  const queryClient = useQueryClient();

  return useMutation<ManufacturerDetailItem, AppError, ManufacturerFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await manufacturerDataSource.create(values)
          : await manufacturerDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: manufacturerKeys.lists() });
      queryClient.setQueryData(manufacturerKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteManufacturer() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await manufacturerDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: manufacturerKeys.all });
    },
  });
}
