import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { productCatalogKeys } from '../../../shared/api/queryKeys';
import { productCatalogDataSource } from './productCatalogDataSource';
import type { ProductCatalogDetailItem, ProductCatalogFormValues } from '../model/types';

export function useUpsertProductCatalog() {
  const queryClient = useQueryClient();

  return useMutation<ProductCatalogDetailItem, AppError, ProductCatalogFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await productCatalogDataSource.create(values)
          : await productCatalogDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: productCatalogKeys.lists() });
      queryClient.setQueryData(productCatalogKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteProductCatalog() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await productCatalogDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productCatalogKeys.all });
    },
  });
}
