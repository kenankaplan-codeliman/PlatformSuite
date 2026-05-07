import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  useEnumTranslation,
  type DataTableColumn,
} from '@platform/ui';
import { useOpportunityListQuery } from '../../../../entities/opportunity/api/useOpportunityQueries';
import type {
  OpportunityListFilter,
  OpportunityListItem,
} from '../../../../entities/opportunity/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function OpportunitiesListPage() {
  const { t } = useTranslation('page.opportunities-list');
  const { t: tEntity } = useTranslation('entity.opportunity');
  const tStage = useEnumTranslation('opportunityStage');
  const navigate = useNavigate();

  const [filters] = useState<OpportunityListFilter>({});

  const query = useOpportunityListQuery({ filters });

  const data = useMemo<OpportunityListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<OpportunityListItem>[]>(
    () => [
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      {
        key: 'accountName',
        title: tEntity('fields.account.label'),
        dataIndex: 'accountName',
      },
      { key: 'stage', title: tEntity('fields.stage.label'), render: (_v, r) => tStage(r.stage) },
      { key: 'amount', title: tEntity('fields.amount.label'), dataIndex: 'amount' },
      {
        key: 'probability',
        title: tEntity('fields.probability.label'),
        render: (_v, r) => `${r.probability}%`,
      },
      {
        key: 'closeDate',
        title: tEntity('fields.closeDate.label'),
        render: (_v, r) =>
          r.closeDate ? new Date(r.closeDate).toLocaleDateString('tr-TR') : '',
      },
    ],
    [tEntity, tStage],
  );

  return (
    <ListPageLayout<OpportunityListItem>
      title={t('title')}
      columns={columns}
      data={data}
      rowKey="id"
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onCreateClick={() => navigate(RoutePaths.OpportunityNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.OpportunityView(record.id))}
    />
  );
}
