import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout } from '../../../../shared/ui/list-page/ListPageLayout';
import type { DataTableColumn } from '../../../../shared/ui/DataTable';
import { useEnumTranslation } from '../../../../shared/lib/i18n/enum';
import {
  defaultPaginationRequest,
  type PaginationRequest,
} from '../../../../shared/types/Pagination';
import { useOrganizationListQuery } from '../../../../entities/organization/api/useOrganizationQueries';
import type {
  AppOrganizationListFilter,
  AppOrganizationListItem,
} from '../../../../entities/organization/model/types';
import { RoutePaths } from '../../../../app/router/paths';

export function OrganizationsListPage() {
  const { t } = useTranslation('page.organizations-list');
  const { t: tEntity } = useTranslation('entity.organization');
  const tType = useEnumTranslation('organizationType');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(defaultPaginationRequest);
  const [filters] = useState<AppOrganizationListFilter>({});

  const query = useOrganizationListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<AppOrganizationListItem>[]>(
    () => [
      { key: 'organizationCode', title: tEntity('fields.organizationCode.label'), dataIndex: 'organizationCode' },
      { key: 'title', title: tEntity('fields.title.label'), render: (_v, r) => r.title ?? r.organizationName },
      { key: 'type', title: tEntity('fields.type.label'), render: (_v, r) => tType(r.type) },
      { key: 'costCenter', title: tEntity('fields.costCenter.label'), dataIndex: 'costCenter' },
      { key: 'parentOrganizationName', title: tEntity('fields.parentOrganization.label'), dataIndex: 'parentOrganizationName' },
    ],
    [tEntity, tType],
  );

  return (
    <ListPageLayout<AppOrganizationListItem>
      title={t('title')}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.OrganizationNew)}
      createLabel={t('createButton')}
      onRowClick={(record) => navigate(RoutePaths.OrganizationView(record.id))}
    />
  );
}
