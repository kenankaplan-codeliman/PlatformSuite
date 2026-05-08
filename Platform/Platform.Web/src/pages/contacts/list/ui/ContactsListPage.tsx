import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ListPageLayout } from "../../../../shared/ui/list-page/ListPageLayout";
import type { DataTableColumn } from "../../../../shared/ui/DataTable";
import { useEnumTranslation } from "../../../../shared/lib/i18n/enum";
import { useContactListQuery } from "../../../../entities/contact/api/useContactQueries";
import type {
  ContactListFilter,
  ContactListItem,
} from "../../../../entities/contact/model/types";
import { RoutePaths } from "../../../../app/router/paths";

export function ContactsListPage() {
  const { t } = useTranslation("page.contacts-list");
  const { t: tEntity } = useTranslation("entity.contact");
  const tStatus = useEnumTranslation("contactStatus");
  const navigate = useNavigate();

  const [filters] = useState<ContactListFilter>({});

  const query = useContactListQuery({ filters });

  const data = useMemo<ContactListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<ContactListItem>[]>(
    () => [
      {
        key: "fullName",
        title: tEntity("fields.fullName.label"),
        dataIndex: "fullName",
      },
      {
        key: "title",
        title: tEntity("fields.title.label"),
        dataIndex: "title",
      },
      {
        key: "department",
        title: tEntity("fields.department.label"),
        dataIndex: "department",
      },
      {
        key: "primaryAccount",
        title: tEntity("fields.primaryAccount.label"),
        render: (_v, r) => r.primaryAccount?.accountName ?? "",
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
        key: "contactStatus",
        title: tEntity("fields.contactStatus.label"),
        render: (_v, r) => tStatus(r.contactStatus),
      },
    ],
    [tEntity, tStatus],
  );

  return (
    <ListPageLayout<ContactListItem>
      title={t("title")}
      columns={columns}
      data={data}
      rowKey="id"
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onCreateClick={() => navigate(RoutePaths.ContactNew)}
      createLabel={t("createButton")}
      onRowClick={(record) => navigate(RoutePaths.ContactView(record.id))}
    />
  );
}
