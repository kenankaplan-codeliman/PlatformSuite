import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { questionnaireKeys } from '../../../shared/api/queryKeys';
import { questionnaireDataSource } from './questionnaireDataSource';
import type {
  QuestionnaireDetailItem,
  QuestionnaireFormValues,
} from '../model/types';

export function useUpsertQuestionnaire() {
  const queryClient = useQueryClient();

  return useMutation<QuestionnaireDetailItem, AppError, QuestionnaireFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await questionnaireDataSource.create(values)
          : await questionnaireDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: questionnaireKeys.lists() });
      queryClient.setQueryData(questionnaireKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteQuestionnaire() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await questionnaireDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnaireKeys.all });
    },
  });
}
