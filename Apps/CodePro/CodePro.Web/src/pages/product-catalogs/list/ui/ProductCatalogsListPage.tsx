import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useProductCatalogListQuery } from '../../../../entities/product-catalog/api/useProductCatalogQueries';
import type {
  ProductCatalogListFilter,
  ProductCatalogListItem,
} from '../../../../entities/product-catalog/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function ProductCatalogsListPage() {
  const { t } = useTranslation('page.product-catalogs-list');
  const { t: tEntity } = useTranslation('entity.product-catalog');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<ProductCatalogListFilter>({});

  const query = useProductCatalogListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<ProductCatalogListItem>[]>(
    () => [
      { key: 'code', title: tEntity('fields.code.label'), dataIndex: 'code' },
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      { key: 'priceCode', title: tEntity('fields.priceCode.label'), dataIndex: 'priceCode' },
      { key: 'productCount', title: tEntity('fields.products.label'), dataIndex: 'productCount' },
      { key: 'organizationCount', title: tEntity('fields.organizations.label'), dataIndex: 'organizationCount' },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<ProductCatalogListItem>
      title={t('title')}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.ProductCatalogNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ProductCatalogView(record.id))}
    />
  );
}
