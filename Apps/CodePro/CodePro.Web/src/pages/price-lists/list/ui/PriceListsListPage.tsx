import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { usePriceListListQuery } from '../../../../entities/price-list/api/usePriceListQueries';
import type {
  PriceListListFilter,
  PriceListListItem,
} from '../../../../entities/price-list/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function PriceListsListPage() {
  const { t } = useTranslation('page.price-lists-list');
  const { t: tEntity } = useTranslation('entity.price-list');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<PriceListListFilter>({});

  const query = usePriceListListQuery({ pagination, filters });

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
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.PriceListNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.PriceListView(record.id))}
    />
  );
}
