import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useBudgetCategoryListQuery } from '../../../../entities/budget-category/api/useBudgetCategoryQueries';
import type {
  BudgetCategoryListFilter,
  BudgetCategoryListItem,
} from '../../../../entities/budget-category/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function BudgetCategoriesListPage() {
  const { t } = useTranslation('page.budget-categories-list');
  const { t: tEntity } = useTranslation('entity.budget-category');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<BudgetCategoryListFilter>({});

  const query = useBudgetCategoryListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<BudgetCategoryListItem>[]>(
    () => [
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
    <ListPageLayout<BudgetCategoryListItem>
      title={t('title')}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.BudgetCategoryNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.BudgetCategoryView(record.id))}
    />
  );
}
