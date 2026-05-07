import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
  filters: QuestionnaireListFilter;
  pageSize?: number;
}

export function useQuestionnaireListQuery(params: UseQuestionnaireListParams) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: questionnaireKeys.list({ filters: params.filters, pageSize }),
    queryFn: ({ pageParam }) =>
      questionnaireDataSource.list({
        pagination: { pageNumber: pageParam, pageSize },
        filters: params.filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.pagination.hasMoreRecord ? allPages.length + 1 : undefined,
  });
}
