import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ListPageLayout, useUrlFilters, useReturnNavigate } from "@platform/ui";
import type { DataTableColumn } from "@platform/ui";
import { useGeneralParameters } from "@platform/ui";
import { useAccountListQuery } from "../../../../entities/account/api/useAccountQueries";
import type {
  AccountListFilter,
  AccountListItem,
} from "../../../../entities/account/model/types";
import {
  accountListFilterDefaults,
  accountListFilterSchema,
} from "../../../../entities/account/model/listFilterSchema";
import { RoutePaths } from "../../../../app/router/paths";
import { AccountsFilterPanel } from "./AccountsFilterPanel";

export function AccountsListPage() {
  const { t } = useTranslation("page.accounts-list");
  const { t: tEntity } = useTranslation("entity.account");
  const { getLabel: getStatusLabel } = useGeneralParameters("AccountStatus");
  const { getLabel: getTypeLabel } = useGeneralParameters("AccountType");
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } = useUrlFilters<AccountListFilter>({
    schema: accountListFilterSchema,
    defaultValues: accountListFilterDefaults,
  });

  const query = useAccountListQuery({ filters });

  const data = useMemo<AccountListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

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
        render: (_v, r) => getTypeLabel(r.accountType),
      },
      {
        key: "accountStatus",
        title: tEntity("fields.accountStatus.label"),
        render: (_v, r) => getStatusLabel(r.accountStatus),
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
    [tEntity, getStatusLabel, getTypeLabel],
  );

  return (
    <ListPageLayout<AccountListItem>
      title={t("title")}
      entityType="Account"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <AccountsFilterPanel
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
      onCreateClick={() => navigate(RoutePaths.AccountNew)}
      createLabel={t("createButton")}
      onRowClick={(record) => navigate(RoutePaths.AccountView(record.id))}
    />
  );
}
