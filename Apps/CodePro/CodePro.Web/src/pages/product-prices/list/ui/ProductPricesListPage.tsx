import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListPageLayout, useUrlFilters, type DataTableColumn, useReturnNavigate } from '@platform/ui';
import { useProductPriceListQuery } from '../../../../entities/product-price/api/useProductPriceQueries';
import type {
  ProductPriceListFilter,
  ProductPriceListItem,
} from '../../../../entities/product-price/model/types';
import {
  productPriceListFilterDefaults,
  productPriceListFilterSchema,
} from '../../../../entities/product-price/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { ProductPricesFilterPanel } from './ProductPricesFilterPanel';

export function ProductPricesListPage() {
  const { t } = useTranslation('page.product-prices-list');
  const { t: tEntity } = useTranslation('entity.product-price');
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<ProductPriceListFilter>({
    schema: productPriceListFilterSchema,
    defaultValues: productPriceListFilterDefaults,
  });

  const query = useProductPriceListQuery({ filters });

  const data = useMemo<ProductPriceListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<ProductPriceListItem>[]>(
    () => [
      { key: 'productCode', title: 'Ürün Kodu', dataIndex: 'productCode' },
      { key: 'productName', title: tEntity('fields.product.label'), dataIndex: 'productName' },
      { key: 'supplierAccountName', title: tEntity('fields.supplier.label'), dataIndex: 'supplierAccountName' },
      { key: 'priceListName', title: tEntity('fields.priceList.label'), dataIndex: 'priceListName' },
      { key: 'minimumQuantity', title: tEntity('fields.minimumQuantity.label'), dataIndex: 'minimumQuantity' },
      {
        key: 'productUnitOfMeasure',
        title: tEntity('fields.unitOfMeasure.label'),
        dataIndex: 'productUnitOfMeasure',
      },
      {
        key: 'unitPrice',
        title: tEntity('fields.unitPrice.label'),
        dataIndex: 'unitPrice',
        align: 'right',
      },
      {
        key: 'currency',
        title: tEntity('fields.currency.label'),
        dataIndex: 'currency',
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
    <ListPageLayout<ProductPriceListItem>
      title={t('title')}
      entityType="ProductPrice"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <ProductPricesFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.ProductPriceNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ProductPriceView(record.id))}
    />
  );
}
