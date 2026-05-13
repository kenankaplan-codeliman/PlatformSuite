import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  useEnumTranslation,
  useUrlFilters,
  type DataTableColumn,
} from '@platform/ui';
import { useContractListQuery } from '../../../../entities/contract/api/useContractQueries';
import type {
  ContractListFilter,
  ContractListItem,
} from '../../../../entities/contract/model/types';
import {
  contractListFilterDefaults,
  contractListFilterSchema,
} from '../../../../entities/contract/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { ContractsFilterPanel } from './ContractsFilterPanel';

export function ContractsListPage() {
  const { t } = useTranslation('page.contracts-list');
  const { t: tEntity } = useTranslation('entity.contract');
  const tType = useEnumTranslation('contractType');
  const tStatus = useEnumTranslation('contractStatus');
  const navigate = useNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<ContractListFilter>({
    schema: contractListFilterSchema,
    defaultValues: contractListFilterDefaults,
  });

  const query = useContractListQuery({ filters });

  const data = useMemo<ContractListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<ContractListItem>[]>(
    () => [
      { key: 'contractNumber', title: tEntity('fields.contractNumber.label'), dataIndex: 'contractNumber' },
      { key: 'subject', title: tEntity('fields.subject.label'), dataIndex: 'subject' },
      {
        key: 'counterpartyName',
        title: tEntity('fields.counterpartyName.label'),
        dataIndex: 'counterpartyName',
      },
      {
        key: 'type',
        title: tEntity('fields.type.label'),
        render: (_v, r) => tType(r.type),
      },
      {
        key: 'status',
        title: tEntity('fields.status.label'),
        render: (_v, r) => tStatus(r.status),
      },
      {
        key: 'amount',
        title: tEntity('fields.amount.label'),
        render: (_v, r) =>
          r.amount !== null && r.amount !== undefined ? `${r.amount} ${r.currency ?? ''}` : '-',
      },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity, tType, tStatus],
  );

  return (
    <ListPageLayout<ContractListItem>
      title={t('title')}
      entityType="Contract"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <ContractsFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.ContractNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ContractView(record.id))}
    />
  );
}
