import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  useEnumTranslation,
  type DataTableColumn,
} from '@platform/ui';
import { useLeadListQuery } from '../../../../entities/lead/api/useLeadQueries';
import type { LeadListFilter, LeadListItem } from '../../../../entities/lead/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function LeadsListPage() {
  const { t } = useTranslation('page.leads-list');
  const { t: tEntity } = useTranslation('entity.lead');
  const tStatus = useEnumTranslation('leadStatus');
  const tSource = useEnumTranslation('leadSource');
  const navigate = useNavigate();

  const [filters] = useState<LeadListFilter>({});

  const query = useLeadListQuery({ filters });

  const data = useMemo<LeadListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<LeadListItem>[]>(
    () => [
      { key: 'subject', title: tEntity('fields.subject.label'), dataIndex: 'subject' },
      { key: 'fullName', title: tEntity('fields.fullName.label'), dataIndex: 'fullName' },
      { key: 'company', title: tEntity('fields.company.label'), dataIndex: 'company' },
      { key: 'email', title: tEntity('fields.email.label'), dataIndex: 'email' },
      { key: 'phone', title: tEntity('fields.phone.label'), dataIndex: 'phone' },
      { key: 'status', title: tEntity('fields.status.label'), render: (_v, r) => tStatus(r.status) },
      { key: 'source', title: tEntity('fields.source.label'), render: (_v, r) => tSource(r.source) },
      { key: 'score', title: tEntity('fields.score.label'), dataIndex: 'score' },
    ],
    [tEntity, tStatus, tSource],
  );

  return (
    <ListPageLayout<LeadListItem>
      title={t('title')}
      columns={columns}
      data={data}
      rowKey="id"
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onCreateClick={() => navigate(RoutePaths.LeadNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.LeadView(record.id))}
    />
  );
}
