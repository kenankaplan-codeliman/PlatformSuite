import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useOfferListQuery } from '../../../../entities/offer/api/useOfferQueries';
import type { OfferListFilter, OfferListItem } from '../../../../entities/offer/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function OffersListPage() {
  const { t } = useTranslation('page.offers-list');
  const { t: tEntity } = useTranslation('entity.offer');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<OfferListFilter>({});
  const query = useOfferListQuery({ pagination, filters });

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
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.OfferNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.OfferView(record.id))}
    />
  );
}
