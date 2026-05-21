import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { DetailPageLayout } from "@platform/ui";
import { FormSection } from "@platform/ui";
import { FormRow } from "@platform/ui";
import { TextField } from "@platform/ui";
import { NumberField } from "@platform/ui";
import {
  SelectField,
  type SelectOption,
} from "@platform/ui";
import { TextAreaField } from "@platform/ui";
import { EntityLookupField } from "@platform/ui";
import { EntityRelationTable } from "@platform/ui";
import { ServicePath } from "@platform/ui";
import { useRouteMode } from "@platform/ui";
import { useOwnerAssignAction } from "@platform/ui";
import { useSetStateAction } from "@platform/ui";
import type { DetailPageAction } from "@platform/ui";
import { useGeneralParameters } from "@platform/ui";
import { RelatedActivitiesTab, type DetailPageTab } from "@platform/ui";
import { AttachmentsField } from "@platform/ui";
import { useAccountQuery } from "../../../../entities/account/api/useAccountQueries";
import {
  useUpsertAccount,
  useDeleteAccount,
} from "../../../../entities/account/api/useAccountMutations";
import { accountSchema } from "../../../../entities/account/model/schema";
import type { AccountFormValues } from "../../../../entities/account/model/types";
import {
  accountDocumentTypes,
  getAccountDocumentTypeLabel,
} from "../../../../entities/account/model/documentTypes";
import { RoutePaths } from "../../../../app/router/paths";

const ACCOUNT_ATTACHMENT_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";

const emptyAccount: AccountFormValues = {
  id: "",
  accountName: "",
  accountType: "Customer",
  accountStatus: "Prospect",
  industry: null,
  annualRevenue: null,
  numberOfEmployees: null,
  website: null,
  description: null,
  parentAccount: null,
  emails: [],
  phones: [],
  addresses: [],
  contacts: [],
  isActive: true,
};

export function AccountDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation("page.accounts-detail");
  const { t: tEntity } = useTranslation("entity.account");
  const { t: tCommon } = useTranslation("common");

  const query = useAccountQuery(id);
  const upsert = useUpsertAccount();
  const deleteMutation = useDeleteAccount();

  // accountType / accountStatus GeneralParameter'dan beslenir — statik enum yok.
  const { options: typeOptions } = useGeneralParameters("AccountType");
  const { options: statusOptions } = useGeneralParameters("AccountStatus");

  // Sahip atama: ayrı action endpoint'i (save mutation'a dahil değil) — view modunda
  // "..." menüsünde "Sahip Ata" + popup; başarıda footer'daki Sahibi alanı tazelenir.
  const ownerAssign = useOwnerAssignAction({
    entityId: id,
    entityType: "Account",
    servicePath: ServicePath.Account.Assign,
  });

  // Aktif/Pasif: ayrı set-state endpoint'i (kendi privilege'ı). Mevcut duruma göre
  // etiket + onay mesajı; başarıda footer "Aktif" alanı + detail query tazelenir.
  const stateToggle = useSetStateAction({
    entityId: id,
    entityType: "Account",
    servicePath: ServicePath.Account.SetState,
    isActive: query.data?.isActive ?? true,
    onSuccess: () => {
      void query.refetch();
    },
  });

  const extraActions = [ownerAssign.action, stateToggle.action].filter(
    (a): a is DetailPageAction => a !== null,
  );

  const title = useMemo(() => {
    if (mode === "new") return tPage("newTitle");
    if (mode === "edit") return tPage("editTitle");
    return query.data?.accountName ?? tPage("viewTitle");
  }, [mode, query.data?.accountName, tPage]);

  const tabs: DetailPageTab[] | undefined =
    mode === "new" || !id
      ? undefined
      : [
          {
            key: "activities",
            label: tCommon("tabs.activities"),
            content: (
              <RelatedActivitiesTab entityType="Account" entityId={id} />
            ),
          },
          {
            key: "attachments",
            label: tCommon("tabs.attachments"),
            content: (
              <div style={{ marginBottom: 16 }}>
                <AttachmentsField
                  entityType="Account"
                  entityId={id}
                  accept={ACCOUNT_ATTACHMENT_ACCEPT}
                  documentTypes={accountDocumentTypes}
                  documentTypeLabel={getAccountDocumentTypeLabel}
                />
              </div>
            ),
          },
        ];

  return (
    <DetailPageLayout<AccountFormValues>
      mode={mode}
      title={title}
      schema={accountSchema}
      defaultValues={emptyAccount}
      data={query.data as AccountFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => {
        await upsert.mutateAsync(values);
      }}
      onDelete={
        id
          ? async () => {
              await deleteMutation.mutateAsync([id]);
            }
          : undefined
      }
      afterSaveNavigation={(saved) => RoutePaths.AccountView(saved.id)}
      tabs={tabs}
      entityType="Account"
      entityId={id}
      extraActions={extraActions}
    >
      {ownerAssign.modal}
      <GeneralSection
        typeOptions={typeOptions}
        statusOptions={statusOptions}
      />
      <DetailsSection />
      <ContactsSection />
    </DetailPageLayout>
  );

  function GeneralSection({
    typeOptions,
    statusOptions,
  }: {
    typeOptions: SelectOption<string>[];
    statusOptions: SelectOption<string>[];
  }) {
    const form = useFormContext<AccountFormValues>();
    return (
      <FormSection title={tEntity("sections.general")} collapsible="expanded">
        <TextField
          name="accountName"
          control={form.control}
          label={tEntity("fields.accountName.label")}
          placeholder={tEntity("fields.accountName.placeholder")}
          required
          maxLength={200}
        />
        <FormRow>
          <SelectField<AccountFormValues>
            name="accountType"
            control={form.control}
            label={tEntity("fields.accountType.label")}
            options={typeOptions}
            required
          />
          <SelectField<AccountFormValues>
            name="accountStatus"
            control={form.control}
            label={tEntity("fields.accountStatus.label")}
            options={statusOptions}
            required
          />
        </FormRow>
        <TextField
          name="industry"
          control={form.control}
          label={tEntity("fields.industry.label")}
          placeholder={tEntity("fields.industry.placeholder")}
          maxLength={200}
        />
        <EntityLookupField
          name="parentAccount"
          control={form.control}
          servicePath={ServicePath.Account.Search}
          label={tEntity("fields.parentAccount.label")}
          allowClear
        />
      </FormSection>
    );
  }

  function ContactsSection() {
    const form = useFormContext<AccountFormValues>();
    return (
      <FormSection title={tEntity("sections.contacts")} collapsible="expanded">
        <EntityRelationTable<AccountFormValues>
          name="contacts"
          control={form.control}
          servicePath={ServicePath.Contact.Search}
          keyField="contactId"
          keyNameField="contactName"
          addLabel={tEntity("contacts.addLabel")}
          modalTitle={tEntity("contacts.modalTitle")}
          nameColumnTitle={tEntity("contacts.nameColumn")}
        />
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<AccountFormValues>();
    return (
      <FormSection title={tEntity("sections.details")} collapsible="expanded">
        <TextField
          name="website"
          control={form.control}
          label={tEntity("fields.website.label")}
          placeholder={tEntity("fields.website.placeholder")}
          maxLength={500}
        />
        <FormRow columns={3}>
          <NumberField
            name="annualRevenue"
            control={form.control}
            label={tEntity("fields.annualRevenue.label")}
            min={0}
            precision={2}
            columns={2}
          />
          <NumberField
            name="numberOfEmployees"
            control={form.control}
            label={tEntity("fields.numberOfEmployees.label")}
            min={0}
            columns={1}
          />
        </FormRow>
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity("fields.description.label")}
          rows={4}
        />
      </FormSection>
    );
  }
}
