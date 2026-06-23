import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ListPageLayout,
  useReturnNavigate,
  useEnumTranslation,
  useUrlFilters,
  type DataTableColumn,
} from '@platform/ui';
import { useOfferListQuery } from '../../../../entities/offer/api/useOfferQueries';
import type { OfferListFilter, OfferListItem } from '../../../../entities/offer/model/types';
import {
  offerListFilterDefaults,
  offerListFilterSchema,
} from '../../../../entities/offer/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { OffersFilterPanel } from './OffersFilterPanel';

export function OffersListPage() {
  const { t } = useTranslation('page.offers-list');
  const { t: tEntity } = useTranslation('entity.offer');
  const tType = useEnumTranslation('offerType');
  const tStatus = useEnumTranslation('offerStatus');
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<OfferListFilter>({
    schema: offerListFilterSchema,
    defaultValues: offerListFilterDefaults,
  });

  const query = useOfferListQuery({ filters });

  const data = useMemo<OfferListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<OfferListItem>[]>(
    () => [
      { key: 'offerNumber', title: tEntity('fields.offerNumber.label'), dataIndex: 'offerNumber' },
      { key: 'subject', title: tEntity('fields.subject.label'), dataIndex: 'subject' },
      {
        key: 'counterpartyName',
        title: tEntity('fields.counterpartyName.label'),
        dataIndex: 'counterpartyName',
      },
      {
        key: 'offerType',
        title: tEntity('fields.offerType.label'),
        render: (_v, r) => tType(r.offerType),
      },
      {
        key: 'status',
        title: tEntity('fields.status.label'),
        render: (_v, r) => tStatus(r.status),
      },
      {
        key: 'grandTotal',
        title: tEntity('fields.grandTotal.label'),
        render: (_v, r) => `${r.grandTotal} ${r.currency}`,
      },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity, tType, tStatus],
  );

  return (
    <ListPageLayout<OfferListItem>
      title={t('title')}
      entityType="Offer"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <OffersFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.OfferNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.OfferView(record.id))}
    />
  );
}
