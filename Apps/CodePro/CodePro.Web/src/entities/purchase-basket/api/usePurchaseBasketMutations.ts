import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { purchaseBasketKeys } from '../../../shared/api/queryKeys';
import { purchaseBasketDataSource } from './purchaseBasketDataSource';
import type { PurchaseBasketDetailItem, PurchaseBasketFormValues } from '../model/types';

export function useUpsertPurchaseBasket() {
  const qc = useQueryClient();
  return useMutation<PurchaseBasketDetailItem, AppError, PurchaseBasketFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew ? await purchaseBasketDataSource.create(values) : await purchaseBasketDataSource.update(values);
      } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: purchaseBasketKeys.lists() });
      qc.setQueryData(purchaseBasketKeys.detail(saved.id), saved);
    },
  });
}

export function useDeletePurchaseBasket() {
  const qc = useQueryClient();
  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try { await purchaseBasketDataSource.delete(id); } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: purchaseBasketKeys.all }),
  });
}
