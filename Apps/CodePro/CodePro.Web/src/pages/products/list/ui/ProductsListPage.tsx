import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, useUrlFilters, type DataTableColumn } from '@platform/ui';
import { useProductListQuery } from '../../../../entities/product/api/useProductQueries';
import type {
  ProductListFilter,
  ProductListItem,
} from '../../../../entities/product/model/types';
import {
  productListFilterDefaults,
  productListFilterSchema,
} from '../../../../entities/product/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { ProductsFilterPanel } from './ProductsFilterPanel';

export function ProductsListPage() {
  const { t } = useTranslation('page.products-list');
  const { t: tEntity } = useTranslation('entity.product');
  const navigate = useNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<ProductListFilter>({
    schema: productListFilterSchema,
    defaultValues: productListFilterDefaults,
  });

  const query = useProductListQuery({ filters });

  const data = useMemo<ProductListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<ProductListItem>[]>(
    () => [
      { key: 'code', title: tEntity('fields.code.label'), dataIndex: 'code' },
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      { key: 'shortDescription', title: tEntity('fields.shortDescription.label'), dataIndex: 'shortDescription' },
      { key: 'productCategoryName', title: tEntity('fields.category.label'), dataIndex: 'productCategoryName' },
      { key: 'unitOfMeasure', title: tEntity('fields.unitOfMeasure.label'), dataIndex: 'unitOfMeasure' },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<ProductListItem>
      title={t('title')}
      entityType="Product"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <ProductsFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.ProductNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ProductView(record.id))}
    />
  );
}
