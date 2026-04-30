import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { priceListKeys } from '../../../shared/api/queryKeys';
import { priceListDataSource } from './priceListDataSource';
import type {
  PriceListDetailItem,
  PriceListFormValues,
} from '../model/types';

export function useUpsertPriceList() {
  const queryClient = useQueryClient();

  return useMutation<PriceListDetailItem, AppError, PriceListFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await priceListDataSource.create(values)
          : await priceListDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: priceListKeys.lists() });
      queryClient.setQueryData(priceListKeys.detail(saved.id), saved);
    },
  });
}

export function useDeletePriceList() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await priceListDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: priceListKeys.all });
    },
  });
}
