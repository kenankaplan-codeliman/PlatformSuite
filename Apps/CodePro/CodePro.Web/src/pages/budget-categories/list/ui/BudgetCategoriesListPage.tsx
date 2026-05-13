import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout, useUrlFilters, type DataTableColumn } from '@platform/ui';
import { useBudgetCategoryListQuery } from '../../../../entities/budget-category/api/useBudgetCategoryQueries';
import type {
  BudgetCategoryListFilter,
  BudgetCategoryListItem,
} from '../../../../entities/budget-category/model/types';
import {
  budgetCategoryListFilterDefaults,
  budgetCategoryListFilterSchema,
} from '../../../../entities/budget-category/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { BudgetCategoriesFilterPanel } from './BudgetCategoriesFilterPanel';

export function BudgetCategoriesListPage() {
  const { t } = useTranslation('page.budget-categories-list');
  const { t: tEntity } = useTranslation('entity.budget-category');
  const navigate = useNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<BudgetCategoryListFilter>({
    schema: budgetCategoryListFilterSchema,
    defaultValues: budgetCategoryListFilterDefaults,
  });

  const query = useBudgetCategoryListQuery({ filters });

  const data = useMemo<BudgetCategoryListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

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
      entityType="BudgetCategory"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <BudgetCategoriesFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.BudgetCategoryNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.BudgetCategoryView(record.id))}
    />
  );
}
