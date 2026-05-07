import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, type DataTableColumn } from '@platform/ui';
import { usePurchaseOrderListQuery } from '../../../../entities/purchase-order/api/usePurchaseOrderQueries';
import type {
  PurchaseOrderListFilter,
  PurchaseOrderListItem,
} from '../../../../entities/purchase-order/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function PurchaseOrdersListPage() {
  const { t } = useTranslation('page.purchase-orders-list');
  const { t: tEntity } = useTranslation('entity.purchase-order');
  const navigate = useNavigate();

  const [filters] = useState<PurchaseOrderListFilter>({});
  const query = usePurchaseOrderListQuery({ filters });

  const data = useMemo<PurchaseOrderListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<PurchaseOrderListItem>[]>(
    () => [
      { key: 'orderNumber', title: tEntity('fields.orderNumber.label'), dataIndex: 'orderNumber' },
      { key: 'title', title: tEntity('fields.title.label'), dataIndex: 'title' },
      { key: 'supplierAccountName', title: tEntity('fields.supplier.label'), dataIndex: 'supplierAccountName' },
      { key: 'status', title: tEntity('fields.status.label'), dataIndex: 'status' },
      { key: 'totalAmount', title: tEntity('fields.totalAmount.label'),
        render: (_v, r) => `${r.totalAmount} ${r.currencyCode ?? ''}` },
      { key: 'isActive', title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—') },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<PurchaseOrderListItem>
      title={t('title')}
      columns={columns}
      data={data}
      rowKey="id"
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onCreateClick={() => navigate(RoutePaths.PurchaseOrderNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.PurchaseOrderView(record.id))}
    />
  );
}
