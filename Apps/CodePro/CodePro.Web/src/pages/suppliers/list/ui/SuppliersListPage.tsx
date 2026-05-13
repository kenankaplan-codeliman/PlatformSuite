import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, useEnumTranslation, useUrlFilters } from '@platform/ui';
import type { DataTableColumn } from '@platform/ui';
import { useSupplierListQuery } from '../../../../entities/supplier/api/useSupplierQueries';
import type {
  SupplierListFilter,
  SupplierListItem,
} from '../../../../entities/supplier/model/types';
import {
  supplierListFilterDefaults,
  supplierListFilterSchema,
} from '../../../../entities/supplier/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { SuppliersFilterPanel } from './SuppliersFilterPanel';

export function SuppliersListPage() {
  const { t } = useTranslation('page.suppliers-list');
  const { t: tEntity } = useTranslation('entity.supplier');
  const tType = useEnumTranslation('supplierType');
  const tStatus = useEnumTranslation('supplierStatus');
  const tCompany = useEnumTranslation('companyType');
  const navigate = useNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<SupplierListFilter>({
    schema: supplierListFilterSchema,
    defaultValues: supplierListFilterDefaults,
  });

  const query = useSupplierListQuery({ filters });

  const data = useMemo<SupplierListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<SupplierListItem>[]>(
    () => [
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      { key: 'vkn', title: tEntity('fields.vkn.label'), dataIndex: 'vkn' },
      {
        key: 'supplierType',
        title: tEntity('fields.supplierType.label'),
        render: (_v, r) => tType(r.supplierType),
      },
      {
        key: 'supplierStatus',
        title: tEntity('fields.supplierStatus.label'),
        render: (_v, r) => tStatus(r.supplierStatus),
      },
      {
        key: 'companyType',
        title: tEntity('fields.companyType.label'),
        render: (_v, r) => tCompany(r.companyType),
      },
      {
        key: 'contactPersonEmail',
        title: tEntity('fields.contactPersonEmail.label'),
        dataIndex: 'contactPersonEmail',
      },
      { key: 'city', title: tEntity('fields.city.label'), dataIndex: 'city' },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity, tType, tStatus, tCompany],
  );

  return (
    <ListPageLayout<SupplierListItem>
      title={t('title')}
      entityType="Supplier"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <SuppliersFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.SupplierNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.SupplierView(record.id))}
    />
  );
}
