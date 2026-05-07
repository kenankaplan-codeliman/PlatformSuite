import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { productImageKeys } from '../../../shared/api/queryKeys';
import { productImageDataSource } from './productImageDataSource';
import type {
  ProductImageItem,
  ReorderProductImagesInput,
  SetDefaultProductImageInput,
  UploadProductImageInput,
} from '../model/types';

export function useUploadProductImage() {
  const queryClient = useQueryClient();

  return useMutation<ProductImageItem, AppError, UploadProductImageInput>({
    mutationFn: async (input) => {
      try {
        return await productImageDataSource.upload(input);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (_saved, input) => {
      queryClient.invalidateQueries({
        queryKey: productImageKeys.byProduct(input.productId),
      });
    },
  });
}

interface DeleteProductImageInput {
  id: string;
  productId: string;
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, DeleteProductImageInput>({
    mutationFn: async (input) => {
      try {
        await productImageDataSource.delete(input.id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (_void, input) => {
      queryClient.invalidateQueries({
        queryKey: productImageKeys.byProduct(input.productId),
      });
    },
  });
}

interface ReorderContext {
  previous: ProductImageItem[] | undefined;
}

export function useReorderProductImages() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, ReorderProductImagesInput, ReorderContext>({
    mutationFn: async (input) => {
      try {
        await productImageDataSource.reorder(input);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onMutate: async (input) => {
      const key = productImageKeys.byProduct(input.productId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ProductImageItem[]>(key);
      if (previous) {
        const reordered = input.imageIds
          .map((id, idx) => {
            const item = previous.find((p) => p.id === id);
            return item ? { ...item, sortOrder: idx } : undefined;
          })
          .filter((x): x is ProductImageItem => !!x);
        queryClient.setQueryData(key, reordered);
      }
      return { previous };
    },
    onError: (_err, input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          productImageKeys.byProduct(input.productId),
          context.previous,
        );
      }
    },
    onSettled: (_data, _err, input) => {
      queryClient.invalidateQueries({
        queryKey: productImageKeys.byProduct(input.productId),
      });
    },
  });
}

export function useSetDefaultProductImage() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, SetDefaultProductImageInput>({
    mutationFn: async (input) => {
      try {
        await productImageDataSource.setDefault(input);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (_void, input) => {
      queryClient.invalidateQueries({
        queryKey: productImageKeys.byProduct(input.productId),
      });
    },
  });
}
