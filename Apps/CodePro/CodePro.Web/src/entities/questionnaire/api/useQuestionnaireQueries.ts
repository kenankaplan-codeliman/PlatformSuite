import { useQuery } from '@tanstack/react-query';
import type { PaginationRequest } from '@platform/ui';
import { questionnaireKeys } from '../../../shared/api/queryKeys';
import { questionnaireDataSource } from './questionnaireDataSource';
import type { QuestionnaireListFilter } from '../model/types';

export function useQuestionnaireQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? questionnaireKeys.detail(id) : questionnaireKeys.detail('none'),
    queryFn: () => questionnaireDataSource.get(id!),
    enabled: !!id,
  });
}

export interface UseQuestionnaireListParams {
  pagination: PaginationRequest;
  filters: QuestionnaireListFilter;
}

export function useQuestionnaireListQuery(params: UseQuestionnaireListParams) {
  return useQuery({
    queryKey: questionnaireKeys.list(params),
    queryFn: () => questionnaireDataSource.list(params),
  });
}
