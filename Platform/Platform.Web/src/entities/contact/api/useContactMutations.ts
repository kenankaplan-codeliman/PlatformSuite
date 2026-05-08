import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactDataSource } from './contactDataSource';
import { contactKeys } from '../../../shared/api/queryKeys';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import type { AppError } from '../../../shared/types/ApiError';
import type { ContactDetailItem, ContactFormValues } from '../model/types';

/** Hem create hem update için tek hook — Id boşsa create, doluysa update. */
export function useUpsertContact() {
  const queryClient = useQueryClient();

  return useMutation<ContactDetailItem, AppError, ContactFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await contactDataSource.create(values)
          : await contactDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.setQueryData(contactKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string[]>({
    mutationFn: async (ids) => {
      try {
        await contactDataSource.deleteMany(ids);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}
