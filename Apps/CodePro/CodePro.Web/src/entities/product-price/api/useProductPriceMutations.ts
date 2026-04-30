import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { productPriceKeys } from '../../../shared/api/queryKeys';
import { productPriceDataSource } from './productPriceDataSource';
import type { ProductPriceDetailItem, ProductPriceFormValues } from '../model/types';

export function useUpsertProductPrice() {
  const queryClient = useQueryClient();

  return useMutation<ProductPriceDetailItem, AppError, ProductPriceFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await productPriceDataSource.create(values)
          : await productPriceDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: productPriceKeys.lists() });
      queryClient.setQueryData(productPriceKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteProductPrice() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await productPriceDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productPriceKeys.all });
    },
  });
}
