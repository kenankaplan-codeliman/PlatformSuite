import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { DetailPageLayout } from "@platform/ui";
import { FormSection } from "@platform/ui";
import { FormRow } from "@platform/ui";
import { TextField } from "@platform/ui";
import { NumberField } from "@platform/ui";
import { CurrencyField } from "@platform/ui";
import { SelectField, type SelectOption } from "@platform/ui";
import { TextAreaField } from "@platform/ui";
import { EntityLookupField } from "@platform/ui";
import { CheckboxField } from "@platform/ui";
import { TableField, type TableFieldColumn } from "@platform/ui";
import { ServicePath } from "@platform/ui";
import { useRouteMode } from "@platform/ui";
import { useOwnerAssignAction } from "@platform/ui";
import { useSetStateAction } from "@platform/ui";
import type { DetailPageAction } from "@platform/ui";
import { useGeneralParameters } from "@platform/ui";
import { RelatedActivitiesTab, type DetailPageTab } from "@platform/ui";
import type { QuickCreateRenderProps } from "@platform/ui";
import { AttachmentsField } from "@platform/ui";
import { AddressField } from "../../../../widgets/address-field";
import { EmailField } from "../../../../widgets/email-field";
import { PhoneField } from "../../../../widgets/phone-field";
import { useAccountQuery } from "../../../../entities/account/api/useAccountQueries";
import {
  useUpsertAccount,
  useDeleteAccount,
} from "../../../../entities/account/api/useAccountMutations";
import { accountSchema } from "../../../../entities/account/model/schema";
import type {
  AccountContactModal,
  AccountFormValues,
} from "../../../../entities/account/model/types";
import {
  accountDocumentTypes,
  getAccountDocumentTypeLabel,
} from "../../../../entities/account/model/documentTypes";
import { RoutePaths } from "../../../../app/router/paths";

const ACCOUNT_ATTACHMENT_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";

const emptyAccount: AccountFormValues = {
  id: "",
  accountName: "",
  accountType: "Customer",
  accountStatus: "Prospect",
  industry: null,
  annualRevenue: null,
  annualRevenueCurrency: null,
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

export function AccountDetailPage({
  embedded,
}: {
  /**
   * Verildiğinde sayfa, lookup quick-create akışı için modal-içi (embedded) modda
   * çalışır: route okuması bypass edilir, mode `new`'e sabitlenir, kayıt sonrası
   * navigasyon yerine `embedded.onCreated` çağrılır.
   */
  embedded?: QuickCreateRenderProps;
} = {}) {
  const route = useRouteMode();
  const mode = embedded ? "new" : route.mode;
  const id = embedded ? undefined : route.id;
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

  // new/edit başlığı DetailPageLayout'ta entityType'tan generic üretilir;
  // burada yalnız view modunun kayıt adını sağlıyoruz.
  const title = useMemo(
    () => query.data?.accountName ?? tPage("viewTitle"),
    [query.data?.accountName, tPage],
  );

  // İletişim Bilgileri her modda var (form-bound, entity ile kaydedilir).
  // Activities/Attachments yalnız kayıtlı entity'de (kendi servisleri, entityId gerekir).
  const tabs: DetailPageTab[] = [
    {
      key: "communication-info",
      label: tEntity("sections.communicationInfo"),
      content: <CommunicationInfoTab />,
    },
    ...(id && mode !== "new"
      ? [
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
        ]
      : []),
  ];

  return (
    <DetailPageLayout<AccountFormValues>
      mode={mode}
      title={title}
      schema={accountSchema}
      defaultValues={
        embedded
          ? { ...emptyAccount, accountName: embedded.initialSearchText ?? "" }
          : emptyAccount
      }
      data={query.data as AccountFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => (await upsert.mutateAsync(values)).id}
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
      embedded={embedded}
      embeddedReferenceName={(saved) => saved.accountName}
    >
      {ownerAssign.modal}
      <GeneralSection typeOptions={typeOptions} statusOptions={statusOptions} />
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
      <FormSection title={tEntity("sections.general")}>
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

        <FormRow>
          <EntityLookupField
            name="parentAccount"
            control={form.control}
            servicePath={ServicePath.Account.Search}
            entityType="Account"
            label={tEntity("fields.parentAccount.label")}
            allowClear
          />
          <TextField
            name="industry"
            control={form.control}
            label={tEntity("fields.industry.label")}
            placeholder={tEntity("fields.industry.placeholder")}
            maxLength={200}
          />
        </FormRow>
      </FormSection>
    );
  }

  function CommunicationInfoTab() {
    const form = useFormContext<AccountFormValues>();
    return (
      <>
        <FormSection
          title={tEntity("sections.emails")}
          collapsible="expanded"
          flush
        >
          <EmailField<AccountFormValues> control={form.control} name="emails" />
        </FormSection>
        <FormSection
          title={tEntity("sections.phones")}
          collapsible="expanded"
          flush
        >
          <PhoneField<AccountFormValues> control={form.control} name="phones" />
        </FormSection>
        <FormSection
          title={tEntity("sections.addresses")}
          collapsible="expanded"
        >
          <AddressField<AccountFormValues>
            control={form.control}
            name="addresses"
          />
        </FormSection>
      </>
    );
  }

  function ContactsSection() {
    const form = useFormContext<AccountFormValues>();

    // IsPrimary tek-açık (radio davranışı): bir satır primary yapılınca diğerleri kapanır.
    const enforceSinglePrimary = (
      rowIndex: number,
      field: string,
      value: unknown,
    ) => {
      if (field !== "isPrimary" || value !== true) return;
      const rows = form.getValues("contacts") ?? [];
      rows.forEach((_, i) => {
        if (i === rowIndex) return;
        const path =
          `contacts.${i}.isPrimary` as `contacts.${number}.isPrimary`;
        if (form.getValues(path)) {
          form.setValue(path, false, { shouldDirty: true });
        }
      });
    };

    const columns: TableFieldColumn<AccountFormValues, AccountContactModal>[] =
      [
        {
          key: "contact",
          header: tEntity("contacts.nameColumn"),
          width: "1fr",
          render: ({ path }) => (
            <EntityLookupField
              name={path("contact")}
              control={form.control}
              servicePath={ServicePath.Contact.Search}
              entityType="Contact"
              required
            />
          ),
        },
        {
          key: "role",
          header: tCommon("relation.role"),
          width: "220px",
          render: ({ path }) => (
            <TextField
              name={path("role")}
              control={form.control}
              maxLength={200}
            />
          ),
        },
        {
          key: "isPrimary",
          header: tCommon("relation.primary"),
          width: "100px",
          align: "center",
          render: ({ path }) => (
            <CheckboxField name={path("isPrimary")} control={form.control} />
          ),
        },
      ];

    return (
      <FormSection
        title={tEntity("sections.contacts")}
        collapsible="expanded"
        flush
      >
        <TableField<AccountFormValues, AccountContactModal>
          control={form.control}
          name="contacts"
          columns={columns}
          newRow={() => ({
            id: crypto.randomUUID(),
            contact: null,
            role: null,
            isPrimary: false,
          })}
          addLabel={tEntity("contacts.addLabel")}
          onRowChange={enforceSinglePrimary}
        />
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<AccountFormValues>();
    const { options: currencyOptions } = useGeneralParameters("CurrencyType");
    return (
      <FormSection title={tEntity("sections.details")} collapsible="expanded">
        <FormRow columns={3}>
          <TextField
            name="website"
            control={form.control}
            label={tEntity("fields.website.label")}
            placeholder={tEntity("fields.website.placeholder")}
            maxLength={500}
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
        <FormRow columns={3}>
          <CurrencyField<AccountFormValues>
            name="annualRevenue"
            control={form.control}
            label={tEntity("fields.annualRevenue.label")}
            min={0}
            precision={2}
            columns={1}
          />
          <SelectField<AccountFormValues>
            name="annualRevenueCurrency"
            control={form.control}
            label={tEntity("fields.annualRevenueCurrency.label")}
            options={currencyOptions}
            allowClear
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
