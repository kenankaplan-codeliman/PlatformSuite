import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
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

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<PurchaseRequestListFilter>({});
  const query = usePurchaseRequestListQuery({ pagination, filters });

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
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.PurchaseRequestNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.PurchaseRequestView(record.id))}
    />
  );
}
