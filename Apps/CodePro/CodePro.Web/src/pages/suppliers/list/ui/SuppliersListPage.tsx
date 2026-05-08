import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, type DataTableColumn } from '@platform/ui';
import { useSupplierListQuery } from '../../../../entities/supplier/api/useSupplierQueries';
import type {
  SupplierListFilter,
  SupplierListItem,
} from '../../../../entities/supplier/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function SuppliersListPage() {
  const { t } = useTranslation('page.suppliers-list');
  const { t: tEntity } = useTranslation('entity.supplier');
  const navigate = useNavigate();

  const [filters] = useState<SupplierListFilter>({});

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
        dataIndex: 'supplierType',
      },
      {
        key: 'supplierStatus',
        title: tEntity('fields.supplierStatus.label'),
        dataIndex: 'supplierStatus',
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
    [tEntity],
  );

  return (
    <ListPageLayout<SupplierListItem>
      title={t('title')}
      columns={columns}
      data={data}
      rowKey="id"
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
