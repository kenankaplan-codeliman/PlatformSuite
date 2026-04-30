import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useProductPriceListQuery } from '../../../../entities/product-price/api/useProductPriceQueries';
import type {
  ProductPriceListFilter,
  ProductPriceListItem,
} from '../../../../entities/product-price/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function ProductPricesListPage() {
  const { t } = useTranslation('page.product-prices-list');
  const { t: tEntity } = useTranslation('entity.product-price');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<ProductPriceListFilter>({});

  const query = useProductPriceListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<ProductPriceListItem>[]>(
    () => [
      { key: 'productCode', title: 'Ürün Kodu', dataIndex: 'productCode' },
      { key: 'productName', title: tEntity('fields.product.label'), dataIndex: 'productName' },
      { key: 'supplierAccountName', title: tEntity('fields.supplier.label'), dataIndex: 'supplierAccountName' },
      { key: 'priceListName', title: tEntity('fields.priceList.label'), dataIndex: 'priceListName' },
      { key: 'minimumQuantity', title: tEntity('fields.minimumQuantity.label'), dataIndex: 'minimumQuantity' },
      {
        key: 'unitPrice',
        title: tEntity('fields.unitPrice.label'),
        render: (_v, r) => `${r.unitPrice} ${r.currency}`,
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
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.ProductPriceNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ProductPriceView(record.id))}
    />
  );
}
