import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  useGeneralParameters,
  useUrlFilters,
  type DataTableColumn,
} from '@platform/ui';
import { useOpportunityListQuery } from '../../../../entities/opportunity/api/useOpportunityQueries';
import type {
  OpportunityListFilter,
  OpportunityListItem,
} from '../../../../entities/opportunity/model/types';
import {
  opportunityListFilterDefaults,
  opportunityListFilterSchema,
} from '../../../../entities/opportunity/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { OpportunitiesFilterPanel } from './OpportunitiesFilterPanel';

// Amount kolonları sadece formatlı sayı gösterir; currency ayrı kolonda.
const formatAmount = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '';
  return amount.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function OpportunitiesListPage() {
  const { t } = useTranslation('page.opportunities-list');
  const { t: tEntity } = useTranslation('entity.opportunity');
  const { getLabel: getStageLabel } = useGeneralParameters('OpportunityStage');
  const navigate = useNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<OpportunityListFilter>({
    schema: opportunityListFilterSchema,
    defaultValues: opportunityListFilterDefaults,
  });

  const query = useOpportunityListQuery({ filters });

  const data = useMemo<OpportunityListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<OpportunityListItem>[]>(
    () => [
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      {
        key: 'opportunityCode',
        title: tEntity('fields.opportunityCode.label'),
        dataIndex: 'opportunityCode',
      },
      {
        key: 'accountName',
        title: tEntity('fields.account.label'),
        dataIndex: 'accountName',
      },
      { key: 'stage', title: tEntity('fields.stage.label'), render: (_v, r) => getStageLabel(r.stage) },
      {
        key: 'estimatedAmount',
        title: tEntity('fields.estimatedAmount.label'),
        align: 'right',
        render: (_v, r) => formatAmount(r.estimatedAmount),
      },
      {
        key: 'actualAmount',
        title: tEntity('fields.actualAmount.label'),
        align: 'right',
        render: (_v, r) => formatAmount(r.actualAmount),
      },
      {
        key: 'currency',
        title: tEntity('fields.currency.label'),
        dataIndex: 'currency',
      },
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
    [tEntity, getStageLabel],
  );

  return (
    <ListPageLayout<OpportunityListItem>
      title={t('title')}
      entityType="Opportunity"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <OpportunitiesFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.OpportunityNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.OpportunityView(record.id))}
    />
  );
}
