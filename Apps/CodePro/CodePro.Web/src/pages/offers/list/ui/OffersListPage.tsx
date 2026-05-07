import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, type DataTableColumn } from '@platform/ui';
import { useOfferListQuery } from '../../../../entities/offer/api/useOfferQueries';
import type { OfferListFilter, OfferListItem } from '../../../../entities/offer/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function OffersListPage() {
  const { t } = useTranslation('page.offers-list');
  const { t: tEntity } = useTranslation('entity.offer');
  const navigate = useNavigate();

  const [filters] = useState<OfferListFilter>({});
  const query = useOfferListQuery({ filters });

  const data = useMemo<OfferListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<OfferListItem>[]>(
    () => [
      { key: 'offerNumber', title: tEntity('fields.offerNumber.label'), dataIndex: 'offerNumber' },
      { key: 'subject', title: tEntity('fields.subject.label'), dataIndex: 'subject' },
      { key: 'counterpartyName', title: tEntity('fields.counterpartyName.label'), dataIndex: 'counterpartyName' },
      { key: 'offerType', title: tEntity('fields.offerType.label'), dataIndex: 'offerType' },
      { key: 'status', title: tEntity('fields.status.label'), dataIndex: 'status' },
      { key: 'grandTotal', title: tEntity('fields.grandTotal.label'),
        render: (_v, r) => `${r.grandTotal} ${r.currency}` },
      { key: 'isActive', title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—') },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<OfferListItem>
      title={t('title')}
      columns={columns}
      data={data}
      rowKey="id"
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
