import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useManufacturerListQuery } from '../../../../entities/manufacturer/api/useManufacturerQueries';
import type {
  ManufacturerListFilter,
  ManufacturerListItem,
} from '../../../../entities/manufacturer/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function ManufacturersListPage() {
  const { t } = useTranslation('page.manufacturers-list');
  const { t: tEntity } = useTranslation('entity.manufacturer');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<ManufacturerListFilter>({});

  const query = useManufacturerListQuery({ pagination, filters });

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
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.ManufacturerNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ManufacturerView(record.id))}
    />
  );
}
