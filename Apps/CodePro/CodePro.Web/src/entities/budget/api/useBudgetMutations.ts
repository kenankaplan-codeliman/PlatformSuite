import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapAxiosError } from '@platform/ui';
import type { AppError } from '@platform/ui';
import { budgetKeys } from '../../../shared/api/queryKeys';
import { budgetDataSource } from './budgetDataSource';
import type { BudgetDetailItem, BudgetFormValues } from '../model/types';

export function useUpsertBudget() {
  const qc = useQueryClient();
  return useMutation<BudgetDetailItem, AppError, BudgetFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        return isNew ? await budgetDataSource.create(values) : await budgetDataSource.update(values);
      } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: budgetKeys.lists() });
      qc.setQueryData(budgetKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try { await budgetDataSource.delete(id); } catch (err) { throw mapAxiosError(err); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: budgetKeys.all }),
  });
}
