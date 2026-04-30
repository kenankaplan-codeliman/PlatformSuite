import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useEDocumentListQuery } from '../../../../entities/edocument/api/useEDocumentQueries';
import type { EDocumentListFilter, EDocumentListItem } from '../../../../entities/edocument/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function EDocumentsListPage() {
  const { t } = useTranslation('page.edocuments-list');
  const { t: tEntity } = useTranslation('entity.edocument');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<EDocumentListFilter>({});
  const query = useEDocumentListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<EDocumentListItem>[]>(
    () => [
      { key: 'subject', title: tEntity('fields.subject.label'), dataIndex: 'subject' },
      { key: 'documentType', title: tEntity('fields.documentType.label'), dataIndex: 'documentType' },
      { key: 'entityType', title: tEntity('fields.entityType.label'), dataIndex: 'entityType' },
      { key: 'status', title: tEntity('fields.status.label'), dataIndex: 'status' },
      { key: 'isActive', title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—') },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<EDocumentListItem>
      title={t('title')}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.EDocumentNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.EDocumentView(record.id))}
    />
  );
}
