import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPageLayout, useUrlFilters, type DataTableColumn, useReturnNavigate } from '@platform/ui';
import { useProductCategoryListQuery } from '../../../../entities/product-category/api/useProductCategoryQueries';
import type {
  ProductCategoryListFilter,
  ProductCategoryListItem,
} from '../../../../entities/product-category/model/types';
import {
  productCategoryListFilterDefaults,
  productCategoryListFilterSchema,
} from '../../../../entities/product-category/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { ProductCategoriesFilterPanel } from './ProductCategoriesFilterPanel';

export function ProductCategoriesListPage() {
  const { t } = useTranslation('page.product-categories-list');
  const { t: tEntity } = useTranslation('entity.product-category');
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<ProductCategoryListFilter>({
    schema: productCategoryListFilterSchema,
    defaultValues: productCategoryListFilterDefaults,
  });

  const query = useProductCategoryListQuery({ filters });

  const data = useMemo<ProductCategoryListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<ProductCategoryListItem>[]>(
    () => [
      { key: 'title', title: tEntity('fields.title.label'), dataIndex: 'title' },
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      { key: 'code', title: tEntity('fields.code.label'), dataIndex: 'code' },
      {
        key: 'parentCategoryName',
        title: tEntity('fields.parentCategoryId.label'),
        dataIndex: 'parentCategoryName',
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
    <ListPageLayout<ProductCategoryListItem>
      title={t('title')}
      entityType="ProductCategory"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <ProductCategoriesFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.ProductCategoryNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ProductCategoryView(record.id))}
    />
  );
}
