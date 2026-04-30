import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useBudgetListQuery } from '../../../../entities/budget/api/useBudgetQueries';
import type { BudgetListFilter, BudgetListItem } from '../../../../entities/budget/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function BudgetsListPage() {
  const { t } = useTranslation('page.budgets-list');
  const { t: tEntity } = useTranslation('entity.budget');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<BudgetListFilter>({});
  const query = useBudgetListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<BudgetListItem>[]>(
    () => [
      { key: 'name', title: tEntity('fields.name.label'), dataIndex: 'name' },
      { key: 'periodType', title: tEntity('fields.periodType.label'), dataIndex: 'periodType' },
      { key: 'budgetCategoryName', title: tEntity('fields.budgetCategoryId.label'), dataIndex: 'budgetCategoryName' },
      { key: 'totalAmount', title: tEntity('fields.totalAmount.label'),
        render: (_v, r) => `${r.totalAmount} ${r.currency}` },
      { key: 'status', title: tEntity('fields.status.label'), dataIndex: 'status' },
      { key: 'isActive', title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—') },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<BudgetListItem>
      title={t('title')}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.BudgetNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.BudgetView(record.id))}
    />
  );
}
