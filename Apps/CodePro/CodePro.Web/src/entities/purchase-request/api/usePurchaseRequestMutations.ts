import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { purchaseRequestKeys } from '../../../shared/api/queryKeys';
import { purchaseRequestDataSource } from './purchaseRequestDataSource';
import type { PurchaseRequestDetailItem, PurchaseRequestFormValues } from '../model/types';

export function useUpsertPurchaseRequest() {
  const qc = useQueryClient();
  return useMutation<PurchaseRequestDetailItem, AppError, PurchaseRequestFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await purchaseRequestDataSource.create(values)
          : await purchaseRequestDataSource.update(values);
      } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: purchaseRequestKeys.lists() });
      qc.setQueryData(purchaseRequestKeys.detail(saved.id), saved);
    },
  });
}

export function useDeletePurchaseRequest() {
  const qc = useQueryClient();
  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try { await purchaseRequestDataSource.delete(id); }
      catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: purchaseRequestKeys.all }),
  });
}
