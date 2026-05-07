import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, type DataTableColumn } from '@platform/ui';
import { usePurchaseRequestListQuery } from '../../../../entities/purchase-request/api/usePurchaseRequestQueries';
import type {
  PurchaseRequestListFilter,
  PurchaseRequestListItem,
} from '../../../../entities/purchase-request/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function PurchaseRequestsListPage() {
  const { t } = useTranslation('page.purchase-requests-list');
  const { t: tEntity } = useTranslation('entity.purchase-request');
  const navigate = useNavigate();

  const [filters] = useState<PurchaseRequestListFilter>({});
  const query = usePurchaseRequestListQuery({ filters });

  const data = useMemo<PurchaseRequestListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<PurchaseRequestListItem>[]>(
    () => [
      { key: 'requestNumber', title: tEntity('fields.requestNumber.label'), dataIndex: 'requestNumber' },
      { key: 'title', title: tEntity('fields.title.label'), dataIndex: 'title' },
      { key: 'status', title: tEntity('fields.status.label'), dataIndex: 'status' },
      { key: 'priority', title: tEntity('fields.priority.label'), dataIndex: 'priority' },
      { key: 'totalAmount', title: tEntity('fields.totalAmount.label'),
        render: (_v, r) => `${r.totalAmount} ${r.currencyCode ?? ''}` },
      { key: 'isActive', title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—') },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<PurchaseRequestListItem>
      title={t('title')}
      columns={columns}
      data={data}
      rowKey="id"
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onCreateClick={() => navigate(RoutePaths.PurchaseRequestNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.PurchaseRequestView(record.id))}
    />
  );
}
