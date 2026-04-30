import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  BudgetDetailItem,
  BudgetFormValues,
  BudgetListFilter,
  BudgetListItem,
} from '../model/types';

export const budgetDataSource = {
  list: async (body: { pagination: PaginationRequest; filters: BudgetListFilter }) =>
    (await httpClient.post<PagedResult<BudgetListItem>>(CodeProServicePath.Budget.List, body)).data,
  get: async (id: string) =>
    (await httpClient.post<BudgetDetailItem>(CodeProServicePath.Budget.Get, { id })).data,
  create: async (values: BudgetFormValues) =>
    (await httpClient.post<BudgetDetailItem>(CodeProServicePath.Budget.Create, values)).data,
  update: async (values: BudgetFormValues) =>
    (await httpClient.post<BudgetDetailItem>(CodeProServicePath.Budget.Update, values)).data,
  delete: async (id: string) => {
    await httpClient.post(CodeProServicePath.Budget.Delete, { id });
  },
};
