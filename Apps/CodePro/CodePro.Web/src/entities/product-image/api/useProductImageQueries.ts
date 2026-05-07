import { useQuery } from '@tanstack/react-query';
import { productImageKeys } from '../../../shared/api/queryKeys';
import { productImageDataSource } from './productImageDataSource';

export function useProductImageListQuery(productId: string | undefined) {
  return useQuery({
    queryKey: productId
      ? productImageKeys.byProduct(productId)
      : productImageKeys.byProduct('none'),
    queryFn: () => productImageDataSource.list(productId!),
    enabled: !!productId,
  });
}
