import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { productCategoryKeys } from '../../../shared/api/queryKeys';
import { productCategoryDataSource } from './productCategoryDataSource';
import type {
  ProductCategoryDetailItem,
  ProductCategoryFormValues,
} from '../model/types';

export function useUpsertProductCategory() {
  const queryClient = useQueryClient();

  return useMutation<ProductCategoryDetailItem, AppError, ProductCategoryFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await productCategoryDataSource.create(values)
          : await productCategoryDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: productCategoryKeys.lists() });
      queryClient.setQueryData(productCategoryKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await productCategoryDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productCategoryKeys.all });
    },
  });
}
