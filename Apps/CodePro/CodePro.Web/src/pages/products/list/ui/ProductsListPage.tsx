import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useProductListQuery } from '../../../../entities/product/api/useProductQueries';
import type {
  ProductListFilter,
  ProductListItem,
} from '../../../../entities/product/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function ProductsListPage() {
  const { t } = useTranslation('page.products-list');
  const { t: tEntity } = useTranslation('entity.product');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<ProductListFilter>({});

  const query = useProductListQuery({ pagination, filters });

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
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.ProductNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ProductView(record.id))}
    />
  );
}
