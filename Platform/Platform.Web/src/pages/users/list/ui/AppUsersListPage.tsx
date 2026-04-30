import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout } from '../../../../shared/ui/list-page/ListPageLayout';
import type { DataTableColumn } from '../../../../shared/ui/DataTable';
import {
  defaultPaginationRequest,
  type PaginationRequest,
} from '../../../../shared/types/Pagination';
import { useAppUserListQuery } from '../../../../entities/app-user/api/useAppUserQueries';
import type {
  AppUserListFilter,
  AppUserListItem,
} from '../../../../entities/app-user/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function AppUsersListPage() {
  const { t } = useTranslation('page.users-list');
  const { t: tEntity } = useTranslation('entity.app-user');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<AppUserListFilter>({});

  const query = useAppUserListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<AppUserListItem>[]>(
    () => [
      {
        key: 'fullName',
        title: tEntity('fields.firstName.label'),
        render: (_v, r) => `${r.firstName} ${r.lastName}`,
      },
      { key: 'email', title: tEntity('fields.email.label'), dataIndex: 'email' },
      { key: 'phoneNumber', title: tEntity('fields.phoneNumber.label'), dataIndex: 'phoneNumber' },
      { key: 'organizationName', title: tEntity('fields.organization.label'), dataIndex: 'organizationName' },
      { key: 'managerName', title: tEntity('fields.manager.label'), dataIndex: 'managerName' },
      {
        key: 'isActive',
        title: tEntity('fields.isActive.label'),
        render: (_v, r) => (r.isActive ? '✓' : '—'),
      },
    ],
    [tEntity],
  );

  return (
    <ListPageLayout<AppUserListItem>
      title={t('title')}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.AppUserNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.AppUserView(record.id))}
    />
  );
}
