import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { budgetCategoryKeys } from '../../../shared/api/queryKeys';
import { budgetCategoryDataSource } from './budgetCategoryDataSource';
import type {
  BudgetCategoryDetailItem,
  BudgetCategoryFormValues,
} from '../model/types';

export function useUpsertBudgetCategory() {
  const queryClient = useQueryClient();

  return useMutation<BudgetCategoryDetailItem, AppError, BudgetCategoryFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew
          ? await budgetCategoryDataSource.create(values)
          : await budgetCategoryDataSource.update(values);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: budgetCategoryKeys.lists() });
      queryClient.setQueryData(budgetCategoryKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteBudgetCategory() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await budgetCategoryDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetCategoryKeys.all });
    },
  });
}
