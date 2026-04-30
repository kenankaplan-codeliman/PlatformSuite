import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { usePurchaseBasketListQuery } from '../../../../entities/purchase-basket/api/usePurchaseBasketQueries';
import type {
  PurchaseBasketListFilter,
  PurchaseBasketListItem,
} from '../../../../entities/purchase-basket/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function PurchaseBasketsListPage() {
  const { t } = useTranslation('page.purchase-baskets-list');
  const { t: tEntity } = useTranslation('entity.purchase-basket');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<PurchaseBasketListFilter>({});
  const query = usePurchaseBasketListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<PurchaseBasketListItem>[]>(
    () => [
      { key: 'status', title: tEntity('fields.status.label'), dataIndex: 'status' },
      { key: 'lineCount', title: tEntity('fields.lineCount.label'), dataIndex: 'lineCount' },
      { key: 'isActive', title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—') },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<PurchaseBasketListItem>
      title={t('title')}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.PurchaseBasketNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.PurchaseBasketView(record.id))}
    />
  );
}
