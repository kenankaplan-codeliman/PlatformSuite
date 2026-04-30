import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useQuestionnaireListQuery } from '../../../../entities/questionnaire/api/useQuestionnaireQueries';
import type {
  QuestionnaireListFilter,
  QuestionnaireListItem,
} from '../../../../entities/questionnaire/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function QuestionnairesListPage() {
  const { t } = useTranslation('page.questionnaires-list');
  const { t: tEntity } = useTranslation('entity.questionnaire');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<QuestionnaireListFilter>({});

  const query = useQuestionnaireListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<QuestionnaireListItem>[]>(
    () => [
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      {
        key: 'relatedModule',
        title: tEntity('fields.relatedModule.label'),
        render: (_v, r) => tEntity(`relatedModule.${r.relatedModule}`),
      },
      {
        key: 'status',
        title: tEntity('fields.status.label'),
        render: (_v, r) => tEntity(`status.${r.status}`),
      },
      { key: 'questionCount', title: tEntity('fields.questions.label'), dataIndex: 'questionCount' },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<QuestionnaireListItem>
      title={t('title')}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.QuestionnaireNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.QuestionnaireView(record.id))}
    />
  );
}
