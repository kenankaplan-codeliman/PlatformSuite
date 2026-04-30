import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useProductCategoryListQuery } from '../../../../entities/product-category/api/useProductCategoryQueries';
import type {
  ProductCategoryListFilter,
  ProductCategoryListItem,
} from '../../../../entities/product-category/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function ProductCategoriesListPage() {
  const { t } = useTranslation('page.product-categories-list');
  const { t: tEntity } = useTranslation('entity.product-category');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<ProductCategoryListFilter>({});

  const query = useProductCategoryListQuery({ pagination, filters });

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
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.ProductCategoryNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ProductCategoryView(record.id))}
    />
  );
}
