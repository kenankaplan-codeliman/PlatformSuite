import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPageLayout, useUrlFilters, type DataTableColumn, useReturnNavigate } from '@platform/ui';
import { useProductCatalogListQuery } from '../../../../entities/product-catalog/api/useProductCatalogQueries';
import type {
  ProductCatalogListFilter,
  ProductCatalogListItem,
} from '../../../../entities/product-catalog/model/types';
import {
  productCatalogListFilterDefaults,
  productCatalogListFilterSchema,
} from '../../../../entities/product-catalog/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { ProductCatalogsFilterPanel } from './ProductCatalogsFilterPanel';

export function ProductCatalogsListPage() {
  const { t } = useTranslation('page.product-catalogs-list');
  const { t: tEntity } = useTranslation('entity.product-catalog');
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<ProductCatalogListFilter>({
    schema: productCatalogListFilterSchema,
    defaultValues: productCatalogListFilterDefaults,
  });

  const query = useProductCatalogListQuery({ filters });

  const data = useMemo<ProductCatalogListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

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
      entityType="ProductCatalog"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <ProductCatalogsFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.ProductCatalogNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ProductCatalogView(record.id))}
    />
  );
}
