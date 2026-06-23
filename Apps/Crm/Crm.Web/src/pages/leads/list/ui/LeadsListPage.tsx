import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ListPageLayout,
  useReturnNavigate,
  useGeneralParameters,
  useUrlFilters,
  type DataTableColumn,
} from '@platform/ui';
import { useLeadListQuery } from '../../../../entities/lead/api/useLeadQueries';
import type { LeadListFilter, LeadListItem } from '../../../../entities/lead/model/types';
import {
  leadListFilterDefaults,
  leadListFilterSchema,
} from '../../../../entities/lead/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { LeadsFilterPanel } from './LeadsFilterPanel';

export function LeadsListPage() {
  const { t } = useTranslation('page.leads-list');
  const { t: tEntity } = useTranslation('entity.lead');
  const { getLabel: getStatusLabel } = useGeneralParameters('LeadStatus');
  const { getLabel: getSourceLabel } = useGeneralParameters('LeadSource');
  const { getLabel: getRatingLabel } = useGeneralParameters('LeadRating');
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<LeadListFilter>({
    schema: leadListFilterSchema,
    defaultValues: leadListFilterDefaults,
  });

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
      { key: 'primaryEmail', title: tEntity('fields.primaryEmail.label'), dataIndex: 'primaryEmail' },
      { key: 'primaryPhone', title: tEntity('fields.primaryPhone.label'), dataIndex: 'primaryPhone' },
      { key: 'status', title: tEntity('fields.status.label'), render: (_v, r) => getStatusLabel(r.status) },
      { key: 'source', title: tEntity('fields.source.label'), render: (_v, r) => getSourceLabel(r.source) },
      { key: 'rating', title: tEntity('fields.rating.label'), render: (_v, r) => (r.rating ? getRatingLabel(r.rating) : '') },
      { key: 'score', title: tEntity('fields.score.label'), dataIndex: 'score' },
    ],
    [tEntity, getStatusLabel, getSourceLabel, getRatingLabel],
  );

  return (
    <ListPageLayout<LeadListItem>
      title={t('title')}
      entityType="Lead"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <LeadsFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.LeadNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.LeadView(record.id))}
    />
  );
}
