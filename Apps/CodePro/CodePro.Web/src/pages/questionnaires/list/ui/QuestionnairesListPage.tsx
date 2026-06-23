import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPageLayout, useUrlFilters, type DataTableColumn, useReturnNavigate } from '@platform/ui';
import { useQuestionnaireListQuery } from '../../../../entities/questionnaire/api/useQuestionnaireQueries';
import type {
  QuestionnaireListFilter,
  QuestionnaireListItem,
} from '../../../../entities/questionnaire/model/types';
import {
  questionnaireListFilterDefaults,
  questionnaireListFilterSchema,
} from '../../../../entities/questionnaire/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { QuestionnairesFilterPanel } from './QuestionnairesFilterPanel';

export function QuestionnairesListPage() {
  const { t } = useTranslation('page.questionnaires-list');
  const { t: tEntity } = useTranslation('entity.questionnaire');
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<QuestionnaireListFilter>({
    schema: questionnaireListFilterSchema,
    defaultValues: questionnaireListFilterDefaults,
  });

  const query = useQuestionnaireListQuery({ filters });

  const data = useMemo<QuestionnaireListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

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
      entityType="Questionnaire"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <QuestionnairesFilterPanel
          values={filters}
          onApply={setFilters}
          onClear={clearFilters}
        />
      }
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onCreateClick={() => navigate(RoutePaths.QuestionnaireNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.QuestionnaireView(record.id))}
    />
  );
}
