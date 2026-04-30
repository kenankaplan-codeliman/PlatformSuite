import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { offerKeys } from '../../../shared/api/queryKeys';
import { offerDataSource } from './offerDataSource';
import type { OfferDetailItem, OfferFormValues } from '../model/types';

export function useUpsertOffer() {
  const qc = useQueryClient();
  return useMutation<OfferDetailItem, AppError, OfferFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew ? await offerDataSource.create(values) : await offerDataSource.update(values);
      } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: offerKeys.lists() });
      qc.setQueryData(offerKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try { await offerDataSource.delete(id); } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: offerKeys.all }),
  });
}
