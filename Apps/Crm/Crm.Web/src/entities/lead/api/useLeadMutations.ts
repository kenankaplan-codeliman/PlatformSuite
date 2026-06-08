import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import {
  accountKeys,
  contactKeys,
  leadKeys,
  opportunityKeys,
} from '../../../shared/api/queryKeys';
import { leadDataSource } from './leadDataSource';
import type {
  ConvertLeadInput,
  ConvertLeadResult,
  LeadDetailItem,
  LeadFormValues,
} from '../model/types';

/** Hem create hem update için tek hook — Id boşsa create, doluysa update. */
export function useUpsertLead() {
  const queryClient = useQueryClient();

  return useMutation<LeadDetailItem, AppError, LeadFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await leadDataSource.create(values)
          : await leadDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.setQueryData(leadKeys.detail(saved.id), saved);
    },
  });
}

/** Lead → Account/Contact (+ opsiyonel Opportunity) dönüşümü. */
export function useConvertLead() {
  const queryClient = useQueryClient();

  return useMutation<ConvertLeadResult, AppError, ConvertLeadInput>({
    mutationFn: async (input) => {
      try {
        return await leadDataSource.convert(input);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (result) => {
      // Lead artık Converted — detayı + listeleri tazele.
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(result.leadId) });
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      // Çapraz etki: oluşturulan kayıtların listeleri.
      if (result.accountId)
        queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      if (result.contactId)
        queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      if (result.opportunityId)
        queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await leadDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
  });
}
