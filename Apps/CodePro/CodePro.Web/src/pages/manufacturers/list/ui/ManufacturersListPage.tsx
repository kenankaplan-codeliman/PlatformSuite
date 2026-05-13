import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, useUrlFilters, type DataTableColumn } from '@platform/ui';
import { useManufacturerListQuery } from '../../../../entities/manufacturer/api/useManufacturerQueries';
import type {
  ManufacturerListFilter,
  ManufacturerListItem,
} from '../../../../entities/manufacturer/model/types';
import {
  manufacturerListFilterDefaults,
  manufacturerListFilterSchema,
} from '../../../../entities/manufacturer/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { ManufacturersFilterPanel } from './ManufacturersFilterPanel';

export function ManufacturersListPage() {
  const { t } = useTranslation('page.manufacturers-list');
  const { t: tEntity } = useTranslation('entity.manufacturer');
  const navigate = useNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<ManufacturerListFilter>({
    schema: manufacturerListFilterSchema,
    defaultValues: manufacturerListFilterDefaults,
  });

  const query = useManufacturerListQuery({ filters });

  const data = useMemo<ManufacturerListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<ManufacturerListItem>[]>(
    () => [
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      {
        key: 'createdAt',
        title: 'Eklendi',
        render: (_v, r) => new Date(r.createdAt).toLocaleDateString('tr-TR'),
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
    <ListPageLayout<ManufacturerListItem>
      title={t('title')}
      entityType="Manufacturer"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <ManufacturersFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.ManufacturerNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ManufacturerView(record.id))}
    />
  );
}
