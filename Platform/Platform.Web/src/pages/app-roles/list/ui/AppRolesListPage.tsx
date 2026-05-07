import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout } from '../../../../shared/ui/list-page/ListPageLayout';
import type { DataTableColumn } from '../../../../shared/ui/DataTable';
import { useAppRoleListQuery } from '../../../../entities/app-role/api/useAppRoleQueries';
import type {
  AppRoleListFilter,
  AppRoleListItem,
} from '../../../../entities/app-role/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function AppRolesListPage() {
  const { t } = useTranslation('page.app-roles-list');
  const { t: tEntity } = useTranslation('entity.app-role');
  const navigate = useNavigate();

  const [filters] = useState<AppRoleListFilter>({});

  const query = useAppRoleListQuery({ filters });

  const data = useMemo<AppRoleListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<AppRoleListItem>[]>(
    () => [
      { key: 'roleName', title: tEntity('fields.roleName.label'), dataIndex: 'roleName' },
      { key: 'description', title: tEntity('fields.description.label'), dataIndex: 'description' },
      {
        key: 'isDefault',
        title: tEntity('fields.isDefault.label'),
        render: (_v, r) => (r.isDefault ? '✓' : '—'),
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
    <ListPageLayout<AppRoleListItem>
      title={t('title')}
      columns={columns}
      data={data}
      rowKey="id"
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onCreateClick={() => navigate(RoutePaths.AppRoleNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.AppRoleView(record.id))}
    />
  );
}
