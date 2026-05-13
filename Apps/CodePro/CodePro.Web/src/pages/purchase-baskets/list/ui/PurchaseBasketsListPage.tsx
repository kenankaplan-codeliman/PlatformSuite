import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  useEnumTranslation,
  useUrlFilters,
  type DataTableColumn,
} from '@platform/ui';
import { usePurchaseBasketListQuery } from '../../../../entities/purchase-basket/api/usePurchaseBasketQueries';
import type {
  PurchaseBasketListFilter,
  PurchaseBasketListItem,
} from '../../../../entities/purchase-basket/model/types';
import {
  purchaseBasketListFilterDefaults,
  purchaseBasketListFilterSchema,
} from '../../../../entities/purchase-basket/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { PurchaseBasketsFilterPanel } from './PurchaseBasketsFilterPanel';

export function PurchaseBasketsListPage() {
  const { t } = useTranslation('page.purchase-baskets-list');
  const { t: tEntity } = useTranslation('entity.purchase-basket');
  const tStatus = useEnumTranslation('purchaseBasketStatus');
  const navigate = useNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<PurchaseBasketListFilter>({
    schema: purchaseBasketListFilterSchema,
    defaultValues: purchaseBasketListFilterDefaults,
  });

  const query = usePurchaseBasketListQuery({ filters });

  const data = useMemo<PurchaseBasketListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<PurchaseBasketListItem>[]>(
    () => [
      {
        key: 'status',
        title: tEntity('fields.status.label'),
        render: (_v, r) => tStatus(r.status),
      },
      { key: 'lineCount', title: tEntity('fields.lineCount.label'), dataIndex: 'lineCount' },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity, tStatus],
  );

  return (
    <ListPageLayout<PurchaseBasketListItem>
      title={t('title')}
      entityType="PurchaseBasket"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <PurchaseBasketsFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.PurchaseBasketNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.PurchaseBasketView(record.id))}
    />
  );
}
