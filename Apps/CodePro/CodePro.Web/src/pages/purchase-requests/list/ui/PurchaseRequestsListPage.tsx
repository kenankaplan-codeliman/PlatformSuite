import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ListPageLayout,
  useReturnNavigate,
  useEnumTranslation,
  useUrlFilters,
  type DataTableColumn,
} from '@platform/ui';
import { usePurchaseRequestListQuery } from '../../../../entities/purchase-request/api/usePurchaseRequestQueries';
import type {
  PurchaseRequestListFilter,
  PurchaseRequestListItem,
} from '../../../../entities/purchase-request/model/types';
import {
  purchaseRequestListFilterDefaults,
  purchaseRequestListFilterSchema,
} from '../../../../entities/purchase-request/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { PurchaseRequestsFilterPanel } from './PurchaseRequestsFilterPanel';

export function PurchaseRequestsListPage() {
  const { t } = useTranslation('page.purchase-requests-list');
  const { t: tEntity } = useTranslation('entity.purchase-request');
  const tStatus = useEnumTranslation('purchaseRequestStatus');
  const tPriority = useEnumTranslation('purchaseRequestPriority');
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<PurchaseRequestListFilter>({
    schema: purchaseRequestListFilterSchema,
    defaultValues: purchaseRequestListFilterDefaults,
  });

  const query = usePurchaseRequestListQuery({ filters });

  const data = useMemo<PurchaseRequestListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<PurchaseRequestListItem>[]>(
    () => [
      { key: 'requestNumber', title: tEntity('fields.requestNumber.label'), dataIndex: 'requestNumber' },
      { key: 'title', title: tEntity('fields.title.label'), dataIndex: 'title' },
      {
        key: 'status',
        title: tEntity('fields.status.label'),
        render: (_v, r) => tStatus(r.status),
      },
      {
        key: 'priority',
        title: tEntity('fields.priority.label'),
        render: (_v, r) => tPriority(r.priority),
      },
      {
        key: 'totalAmount',
        title: tEntity('fields.totalAmount.label'),
        render: (_v, r) => `${r.totalAmount} ${r.currencyCode ?? ''}`,
      },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity, tStatus, tPriority],
  );

  return (
    <ListPageLayout<PurchaseRequestListItem>
      title={t('title')}
      entityType="PurchaseRequest"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <PurchaseRequestsFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.PurchaseRequestNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.PurchaseRequestView(record.id))}
    />
  );
}
