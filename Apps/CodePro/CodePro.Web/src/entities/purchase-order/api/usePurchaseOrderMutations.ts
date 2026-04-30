import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { purchaseOrderKeys } from '../../../shared/api/queryKeys';
import { purchaseOrderDataSource } from './purchaseOrderDataSource';
import type { PurchaseOrderDetailItem, PurchaseOrderFormValues } from '../model/types';

export function useUpsertPurchaseOrder() {
  const qc = useQueryClient();
  return useMutation<PurchaseOrderDetailItem, AppError, PurchaseOrderFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew ? await purchaseOrderDataSource.create(values) : await purchaseOrderDataSource.update(values);
      } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      qc.setQueryData(purchaseOrderKeys.detail(saved.id), saved);
    },
  });
}

export function useDeletePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try { await purchaseOrderDataSource.delete(id); } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: purchaseOrderKeys.all }),
  });
}
