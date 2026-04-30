import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ListPageLayout,
  defaultPaginationRequest,
  type DataTableColumn,
  type PaginationRequest,
} from '@platform/ui';
import { useContractListQuery } from '../../../../entities/contract/api/useContractQueries';
import type { ContractListFilter, ContractListItem } from '../../../../entities/contract/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function ContractsListPage() {
  const { t } = useTranslation('page.contracts-list');
  const { t: tEntity } = useTranslation('entity.contract');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<ContractListFilter>({});
  const query = useContractListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<ContractListItem>[]>(
    () => [
      { key: 'contractNumber', title: tEntity('fields.contractNumber.label'), dataIndex: 'contractNumber' },
      { key: 'subject', title: tEntity('fields.subject.label'), dataIndex: 'subject' },
      { key: 'counterpartyName', title: tEntity('fields.counterpartyName.label'), dataIndex: 'counterpartyName' },
      { key: 'type', title: tEntity('fields.type.label'), dataIndex: 'type' },
      { key: 'status', title: tEntity('fields.status.label'), dataIndex: 'status' },
      { key: 'amount', title: tEntity('fields.amount.label'),
        render: (_v, r) => r.amount !== null && r.amount !== undefined ? `${r.amount} ${r.currency ?? ''}` : '-' },
      { key: 'isActive', title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—') },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<ContractListItem>
      title={t('title')}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.ContractNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.ContractView(record.id))}
    />
  );
}
