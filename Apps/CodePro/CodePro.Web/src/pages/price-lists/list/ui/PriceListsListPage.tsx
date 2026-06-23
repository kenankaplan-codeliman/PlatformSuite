import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPageLayout, useUrlFilters, type DataTableColumn, useReturnNavigate } from '@platform/ui';
import { usePriceListListQuery } from '../../../../entities/price-list/api/usePriceListQueries';
import type {
  PriceListListFilter,
  PriceListListItem,
} from '../../../../entities/price-list/model/types';
import {
  priceListListFilterDefaults,
  priceListListFilterSchema,
} from '../../../../entities/price-list/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { PriceListsFilterPanel } from './PriceListsFilterPanel';

export function PriceListsListPage() {
  const { t } = useTranslation('page.price-lists-list');
  const { t: tEntity } = useTranslation('entity.price-list');
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<PriceListListFilter>({
    schema: priceListListFilterSchema,
    defaultValues: priceListListFilterDefaults,
  });

  const query = usePriceListListQuery({ filters });

  const data = useMemo<PriceListListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<PriceListListItem>[]>(
    () => [
      { key: 'code', title: tEntity('fields.code.label'), dataIndex: 'code' },
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      {
        key: 'supplierAccountName',
        title: tEntity('fields.supplier.label'),
        dataIndex: 'supplierAccountName',
      },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<PriceListListItem>
      title={t('title')}
      entityType="PriceList"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <PriceListsFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.PriceListNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.PriceListView(record.id))}
    />
  );
}
