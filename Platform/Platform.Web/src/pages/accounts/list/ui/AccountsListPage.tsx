import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ListPageLayout } from "../../../../shared/ui/list-page/ListPageLayout";
import type { DataTableColumn } from "../../../../shared/ui/DataTable";
import { useEnumTranslation } from "../../../../shared/lib/i18n/enum";
import {
  defaultPaginationRequest,
  type PaginationRequest,
} from "../../../../shared/types/Pagination";
import { useAccountListQuery } from "../../../../entities/account/api/useAccountQueries";
import type {
  AccountListFilter,
  AccountListItem,
} from "../../../../entities/account/model/types";
import { RoutePaths } from "../../../../app/router/paths";

export function AccountsListPage() {
  const { t } = useTranslation("page.accounts-list");
  const { t: tEntity } = useTranslation("entity.account");
  const tStatus = useEnumTranslation("accountStatus");
  const tType = useEnumTranslation("accountType");
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationRequest>(
    defaultPaginationRequest,
  );
  const [filters] = useState<AccountListFilter>({});

  const query = useAccountListQuery({ pagination, filters });

  const columns = useMemo<DataTableColumn<AccountListItem>[]>(
    () => [
      {
        key: "accountName",
        title: tEntity("fields.accountName.label"),
        dataIndex: "accountName",
      },
      {
        key: "accountType",
        title: tEntity("fields.accountType.label"),
        render: (_v, r) => tType(r.accountType),
      },
      {
        key: "accountStatus",
        title: tEntity("fields.accountStatus.label"),
        render: (_v, r) => tStatus(r.accountStatus),
      },
      {
        key: "industry",
        title: tEntity("fields.industry.label"),
        dataIndex: "industry",
      },
      {
        key: "primaryEmail",
        title: tEntity("fields.primaryEmail.label"),
        dataIndex: "primaryEmail",
      },
      {
        key: "primaryPhone",
        title: tEntity("fields.primaryPhone.label"),
        dataIndex: "primaryPhone",
      },
      {
        key: "primaryCity",
        title: tEntity("fields.primaryCity.label"),
        dataIndex: "primaryCity",
      },
    ],
    [tEntity, tStatus, tType],
  );

  return (
    <ListPageLayout<AccountListItem>
      title={t("title")}
      columns={columns}
      data={query.data?.data ?? []}
      rowKey="id"
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      pagination={pagination}
      paginationResponse={query.data?.pagination}
      onPaginationChange={setPagination}
      onCreateClick={() => navigate(RoutePaths.AccountNew)}
      createLabel={t("createButton")}
      onRowClick={(record) => navigate(RoutePaths.AccountView(record.id))}
    />
  );
}
