import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ListPageLayout,
  useReturnNavigate,
  useEnumTranslation,
  useUrlFilters,
  type DataTableColumn,
} from '@platform/ui';
import { useEDocumentListQuery } from '../../../../entities/edocument/api/useEDocumentQueries';
import type {
  EDocumentListFilter,
  EDocumentListItem,
} from '../../../../entities/edocument/model/types';
import {
  eDocumentListFilterDefaults,
  eDocumentListFilterSchema,
} from '../../../../entities/edocument/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { EDocumentsFilterPanel } from './EDocumentsFilterPanel';

export function EDocumentsListPage() {
  const { t } = useTranslation('page.edocuments-list');
  const { t: tEntity } = useTranslation('entity.edocument');
  const tStatus = useEnumTranslation('eDocumentStatus');
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<EDocumentListFilter>({
    schema: eDocumentListFilterSchema,
    defaultValues: eDocumentListFilterDefaults,
  });

  const query = useEDocumentListQuery({ filters });

  const data = useMemo<EDocumentListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<EDocumentListItem>[]>(
    () => [
      { key: 'subject', title: tEntity('fields.subject.label'), dataIndex: 'subject' },
      { key: 'documentType', title: tEntity('fields.documentType.label'), dataIndex: 'documentType' },
      { key: 'entityType', title: tEntity('fields.entityType.label'), dataIndex: 'entityType' },
      {
        key: 'status',
        title: tEntity('fields.status.label'),
        render: (_v, r) => tStatus(r.status),
      },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity, tStatus],
  );

  return (
    <ListPageLayout<EDocumentListItem>
      title={t('title')}
      entityType="EDocument"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <EDocumentsFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.EDocumentNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.EDocumentView(record.id))}
    />
  );
}
