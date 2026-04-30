import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { eDocumentKeys } from '../../../shared/api/queryKeys';
import { eDocumentDataSource } from './eDocumentDataSource';
import type { EDocumentDetailItem, EDocumentFormValues } from '../model/types';

export function useUpsertEDocument() {
  const qc = useQueryClient();
  return useMutation<EDocumentDetailItem, AppError, EDocumentFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew ? await eDocumentDataSource.create(values) : await eDocumentDataSource.update(values);
      } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: eDocumentKeys.lists() });
      qc.setQueryData(eDocumentKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteEDocument() {
  const qc = useQueryClient();
  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try { await eDocumentDataSource.delete(id); } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: eDocumentKeys.all }),
  });
}
