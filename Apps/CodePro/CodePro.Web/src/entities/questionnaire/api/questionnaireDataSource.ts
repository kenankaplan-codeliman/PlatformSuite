import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  QuestionnaireDetailItem,
  QuestionnaireFormValues,
  QuestionnaireListFilter,
  QuestionnaireListItem,
} from '../model/types';

interface QuestionnaireListBody {
  pagination: PaginationRequest;
  filters: QuestionnaireListFilter;
}

interface IdBody {
  id: string;
}

export const questionnaireDataSource = {
  list: async (body: QuestionnaireListBody): Promise<PagedResult<QuestionnaireListItem>> => {
    const response = await httpClient.post<PagedResult<QuestionnaireListItem>>(
      CodeProServicePath.Questionnaire.List,
      body,
    );
    return response.data;
  },

  get: async (id: string): Promise<QuestionnaireDetailItem> => {
    const response = await httpClient.post<QuestionnaireDetailItem>(
      CodeProServicePath.Questionnaire.Get,
      { id } satisfies IdBody,
    );
    return response.data;
  },

  create: async (values: QuestionnaireFormValues): Promise<QuestionnaireDetailItem> => {
    const response = await httpClient.post<QuestionnaireDetailItem>(
      CodeProServicePath.Questionnaire.Create,
      values,
    );
    return response.data;
  },

  update: async (values: QuestionnaireFormValues): Promise<QuestionnaireDetailItem> => {
    const response = await httpClient.post<QuestionnaireDetailItem>(
      CodeProServicePath.Questionnaire.Update,
      values,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(CodeProServicePath.Questionnaire.Delete, { id } satisfies IdBody);
  },
};
