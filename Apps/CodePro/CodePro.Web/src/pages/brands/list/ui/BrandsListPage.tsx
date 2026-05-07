import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, type DataTableColumn } from '@platform/ui';
import { useBrandListQuery } from '../../../../entities/brand/api/useBrandQueries';
import type { BrandListFilter, BrandListItem } from '../../../../entities/brand/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function BrandsListPage() {
  const { t } = useTranslation('page.brands-list');
  const { t: tEntity } = useTranslation('entity.brand');
  const navigate = useNavigate();

  const [filters] = useState<BrandListFilter>({});

  const query = useBrandListQuery({ filters });

  const data = useMemo<BrandListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<BrandListItem>[]>(
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
    <ListPageLayout<BrandListItem>
      title={t('title')}
      columns={columns}
      data={data}
      rowKey="id"
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onCreateClick={() => navigate(RoutePaths.BrandNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.BrandView(record.id))}
    />
  );
}
